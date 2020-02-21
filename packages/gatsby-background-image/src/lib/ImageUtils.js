import { hasArtDirectionArray, matchesMedia } from './MediaUtils'
import { filteredJoin, isBrowser, isString } from './SimpleUtils'

/**
 * Returns the availability of the HTMLPictureElement unless in SSR mode.
 *
 * @return {boolean}
 */
export const hasPictureElement = () =>
  typeof HTMLPictureElement !== `undefined` || typeof window === `undefined`

/**
 * Checks if fluid or fixed are image arrays.
 *
 * @param props   object   The props to check for images.
 * @return {boolean}
 */
export const hasImageArray = props =>
  Boolean(
    (props.fluid && Array.isArray(props.fluid)) ||
      (props.fixed && Array.isArray(props.fixed))
  )

/**
 * Extracts a value from an imageRef, image object or an array of them.
 *
 * @param data        HTMLImageElement||object||Array   Data to extract from.
 * @param propName    string    Property to extract.
 * @param addUrl      boolean   Should returned strings be encased in `url()`?
 * @param returnArray boolean   Switches between returning an array and a string.
 * @param checkLoaded boolean   Turns checking for imageLoaded() on and off.
 * @return {string||array}
 */
export const getCurrentFromData = ({
  data,
  propName,
  addUrl = true,
  returnArray = false,
  checkLoaded = true,
}) => {
  if (!data || !propName) return ``
  // Handle tracedSVG with "special care".
  const tracedSVG = propName === `tracedSVG`
  if (Array.isArray(data) && !hasArtDirectionArray({ fluid: data })) {
    // Filter out all elements not having the propName and return remaining.
    const imageString = data
      // .filter(dataElement => {
      //   return propName in dataElement && dataElement[propName]
      // })
      .map(dataElement => {
        // If `currentSrc` or `src` is needed, check image load completion first.
        if (propName === `currentSrc` || propName === 'src') {
          return checkLoaded
            ? (imageLoaded(dataElement) && dataElement[propName]) || ``
            : dataElement[propName]
        }
        // Check if CSS strings should be parsed.
        if (propName === `CSS_STRING` && isString(dataElement)) {
          return dataElement
        }
        return isString(dataElement)
          ? dataElement
          : dataElement && propName in dataElement
          ? dataElement[propName]
          : ``
      })
    // Encapsulate in URL string and return.
    return getUrlString({
      imageString,
      tracedSVG,
      addUrl,
      returnArray,
    })
  }
  if (
    hasArtDirectionArray({ fluid: data }) &&
    (propName === `currentSrc` ||
      propName === `src` ||
      propName === `base64` ||
      tracedSVG)
  ) {
    const currentData = getCurrentSrcData({ fluid: data })
    return propName in currentData
      ? getUrlString({ imageString: currentData[propName], tracedSVG, addUrl })
      : ``
  }
  // If `currentSrc` or `src` is needed, check image load completion first.
  if ((propName === `currentSrc` || propName === 'src') && propName in data) {
    return getUrlString({
      imageString: checkLoaded
        ? (imageLoaded(data) && data[propName]) || ``
        : data[propName],
      addUrl,
    })
  }
  return propName in data
    ? getUrlString({ imageString: data[propName], tracedSVG, addUrl })
    : ``
}

/**
 * Find the source of an image to use as a key in the image cache.
 * Use `the first matching image in either `fixed` or `fluid`
 *
 * @param {{fluid: {src: string}[], fixed: {src: string}[]}} args
 * @return {string|null}
 */
export const getImageSrcKey = ({ fluid, fixed }) => {
  const data = getCurrentSrcData({ fluid, fixed })

  return data ? data.src || null : null
}

/**
 * Returns the current src if possible with art-direction support.
 *
 * @param fluid         object    Fluid Image (Array) if existent.
 * @param fixed         object    Fixed Image (Array) if existent.
 * @param returnArray   boolean   Return original image stack.
 * @param index         boolean   The image to return for image stacks.
 * @return {*}
 */
export const getCurrentSrcData = ({ fluid, fixed, returnArray }, index = 0) => {
  const currentData = fluid || fixed
  if (hasImageArray({ fluid, fixed })) {
    if (returnArray) {
      return currentData
    }
    if (isBrowser() && hasArtDirectionArray({ fluid, fixed })) {
      // Do we have an image for the current Viewport?
      const mediaData = currentData.slice().reverse()
      const foundMedia = mediaData.findIndex(matchesMedia)
      if (foundMedia !== -1) {
        return mediaData[foundMedia]
      }
    }
    // Else return the selected image.
    return currentData[index]
  }
  return currentData
}

/**
 * Return the first image of an imageStack
 *
 * @param fluid   object    Fluid Image (Array) if existent.
 * @param fixed   object    Fixed Image (Array) if existent.
 * @param index
 * @return {*}
 */
export const getSelectedImage = ({ fluid, fixed }, index = 0) => {
  const currentData = fluid || fixed
  if (hasImageArray({ fluid, fixed })) {
    // Fall back on first image if `index` has no entry.
    return currentData[index] || currentData[0]
  }
  return currentData
}

/**
 * Encapsulates an imageString with a url if needed.
 *
 * @param imageString   string    String to encapsulate.
 * @param tracedSVG     boolean   Special care for SVGs.
 * @param addUrl        boolean   If the string should be encapsulated or not.
 * @param returnArray   boolean   Return concatenated string or Array.
 * @param hasImageUrls  boolean   Force return of quoted string(s) for url().
 * @return {string||array}
 */
export const getUrlString = ({
  imageString,
  tracedSVG = false,
  addUrl = true,
  returnArray = false,
  hasImageUrls = false,
}) => {
  if (Array.isArray(imageString)) {
    const stringArray = imageString.map(currentString => {
      if (currentString) {
        const base64 = isBase64(currentString)
        const imageUrl = hasImageUrls || hasImageUrl(imageString)
        const currentReturnString =
          currentString && tracedSVG
            ? `"${currentString}"`
            : currentString && !base64 && !tracedSVG && imageUrl
            ? `'${currentString}'`
            : currentString
        return addUrl && currentString
          ? `url(${currentReturnString})`
          : currentReturnString
      }
      return currentString
    })
    return returnArray ? stringArray : filteredJoin(stringArray)
  }
  const base64 = isBase64(imageString)
  const imageUrl = hasImageUrls || hasImageUrl(imageString)
  const returnString =
    imageString && tracedSVG
      ? `"${imageString}"`
      : imageString && !base64 && !tracedSVG && imageUrl
      ? `'${imageString}'`
      : imageString
  return imageString ? (addUrl ? `url(${returnString})` : returnString) : ``
}

/**
 * Checks a (possible) string on having `base64` in it.
 *
 * @param base64String        {string|*}    The string to check.
 * @return {boolean|boolean}
 */
export const isBase64 = base64String =>
  isString(base64String) && base64String.indexOf(`base64`) !== -1

/**
 * Checks a (possible) string on having `http` in it.
 *
 * @param imageString         {string|*}    The string to check.
 * @return {boolean|boolean}
 */
export const hasImageUrl = imageString =>
  isString(imageString) && imageString.substr(0, 4) === `http`

/**
 * Checks if any image props have changed.
 *
 * @param props
 * @param prevProps
 * @return {*}
 */
export const imagePropsChanged = (props, prevProps) =>
  // Do we have different image types?
  (props.fluid && !prevProps.fluid) ||
  (props.fixed && !prevProps.fixed) ||
  imageArrayPropsChanged(props, prevProps) ||
  // Are single image sources different?
  (props.fluid && prevProps.fluid && props.fluid.src !== prevProps.fluid.src) ||
  (props.fixed && prevProps.fixed && props.fixed.src !== prevProps.fixed.src)

/**
 * Decides if two given props with array images differ.
 *
 * @param props
 * @param prevProps
 * @return {boolean}
 */
export const imageArrayPropsChanged = (props, prevProps) => {
  const isPropsFluidArray = Array.isArray(props.fluid)
  const isPrevPropsFluidArray = Array.isArray(prevProps.fluid)
  const isPropsFixedArray = Array.isArray(props.fixed)
  const isPrevPropsFixedArray = Array.isArray(prevProps.fixed)

  if (
    // Did the props change to a single image?
    (isPropsFluidArray && !isPrevPropsFluidArray) ||
    (isPropsFixedArray && !isPrevPropsFixedArray) ||
    // Did the props change to an Array?
    (!isPropsFluidArray && isPrevPropsFluidArray) ||
    (!isPropsFixedArray && isPrevPropsFixedArray)
  ) {
    return true
  }
  // Are the lengths or sources in the Arrays different?
  if (isPropsFluidArray && isPrevPropsFluidArray) {
    if (props.fluid.length === prevProps.fluid.length) {
      // Check for individual image or CSS string changes.
      return props.fluid.some(
        (image, index) => image.src !== prevProps.fluid[index].src
      )
    }
    return true
  }
  if (isPropsFixedArray && isPrevPropsFixedArray) {
    if (props.fixed.length === prevProps.fixed.length) {
      // Check for individual image or CSS string changes.
      return props.fixed.some(
        (image, index) => image.src !== prevProps.fixed[index].src
      )
    }
    return true
  }
}

/**
 * Creates an array with a transparent dummy pixel for background-* properties.
 *
 * @param length
 * @return {any[]}
 */
export const createDummyImageArray = length => {
  const DUMMY_IMG = `data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==`
  const dummyImageURI = getUrlString({ imageString: DUMMY_IMG })
  return Array(length).fill(dummyImageURI)
}

/**
 * Checks if an image really was fully loaded.
 *
 * @param imageRef  HTMLImageElement  Reference to an image.
 * @return {boolean}
 */
export const imageLoaded = imageRef =>
  imageRef
    ? imageRef.complete &&
      imageRef.naturalWidth !== 0 &&
      imageRef.naturalHeight !== 0
    : false
