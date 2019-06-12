import {
  combineArray,
  convertProps,
  filteredJoin,
  hasImageArray,
} from './HelperUtils'

const imageCache = Object.create({})
/**
 * Cache if we've seen an image before so we don't both with
 * lazy-loading & fading in on subsequent mounts.
 *
 * @param props
 * @return {*|boolean}
 */
export const inImageCache = props => {
  const convertedProps = convertProps(props)
  if (hasImageArray(convertedProps)) {
    return allInImageCache(props)
  } else {
    // Find src
    const src = convertedProps.fluid
      ? convertedProps.fluid.src
      : convertedProps.fixed
      ? convertedProps.fixed.src
      : null

    return imageCache[src] || false
  }
}

/**
 * Processes an array of cached images for inImageCache.
 *
 * @param props  object    Component Props (with fluid or fixed as array).
 * @return {*|boolean}
 */
export const allInImageCache = props => {
  const convertedProps = convertProps(props)
  // Extract Image Array.
  const imageStack = convertedProps.fluid || convertedProps.fixed
  // Only return true if every image is in cache.
  return imageStack.every(imageData => {
    if (convertedProps.fluid) {
      return inImageCache({ fluid: imageData })
    } else {
      return inImageCache({ fixed: imageData })
    }
  })
}

/**
 * Adds an Image to imageCache.
 *
 * @param props
 */
export const activateCacheForImage = props => {
  const convertedProps = convertProps(props)
  if (hasImageArray(convertedProps)) {
    return activateCacheForMultipleImages(props)
  } else {
    // Find src
    const src = convertedProps.fluid
      ? convertedProps.fluid.src
      : convertedProps.fixed
      ? convertedProps.fixed.src
      : null
    if (src) {
      imageCache[src] = true
    }
  }
}

/**
 * Activates the Cache for multiple Images.
 *
 * @param props
 */
export const activateCacheForMultipleImages = props => {
  const convertedProps = convertProps(props)
  // Extract Image Array.
  const imageStack = convertedProps.fluid || convertedProps.fixed
  imageStack.forEach(imageData => {
    if (convertedProps.fluid) {
      activateCacheForImage({ fluid: imageData })
    } else {
      activateCacheForImage({ fixed: imageData })
    }
  })
}

/**
 * Resets the image cache (especially important for reliable tests).
 */
export const resetImageCache = () => {
  for (const prop in imageCache) delete imageCache[prop]
}

/**
 * Returns the availability of the HTMLPictureElement unless in SSR mode.
 *
 * @return {boolean}
 */
export const hasPictureElement = () =>
  typeof HTMLPictureElement !== `undefined` || typeof window === `undefined`

/**
 * Creates an image reference to be activated on critical or visibility.
 * @param props
 * @param onLoad
 * @return {HTMLImageElement|null|Array}
 */
export const createPictureRef = (props, onLoad) => {
  const convertedProps = convertProps(props)
  if (
    typeof window !== `undefined` &&
    (typeof convertedProps.fluid !== `undefined` ||
      typeof convertedProps.fixed !== `undefined`)
  ) {
    if (hasImageArray(convertedProps)) {
      return createMultiplePictureRefs(props, onLoad)
    } else {
      const img = new Image()

      img.onload = () => onLoad()

      if (!img.complete && typeof convertedProps.onLoad === `function`) {
        img.addEventListener('load', convertedProps.onLoad)
      }
      if (typeof convertedProps.onError === `function`) {
        img.addEventListener('error', convertedProps.onError)
      }
      if (convertedProps.crossOrigin) {
        img.crossOrigin = convertedProps.crossOrigin
      }

      // Only directly activate the image if critical (preload).
      if (convertedProps.critical || convertedProps.isVisible) {
        return activatePictureRef(img, convertedProps)
      }

      return img
    }
  }
  return null
}

/**
 * Creates multiple image references. Internal function.
 *
 * @param props   object    Component Props (with fluid or fixed as array).
 * @param onLoad  function  Callback for load handling.
 */
export const createMultiplePictureRefs = (props, onLoad) => {
  const convertedProps = convertProps(props)

  // Extract Image Array.
  const imageStack = convertedProps.fluid || convertedProps.fixed
  return imageStack.map(imageData => {
    if (convertedProps.fluid) {
      return createPictureRef({ ...convertedProps, fluid: imageData }, onLoad)
    } else {
      return createPictureRef({ ...convertedProps, fixed: imageData }, onLoad)
    }
  })
}

/**
 * Creates a picture element for the browser to decide which image to load.
 *
 * @param imageRef
 * @param props
 * @return {null|Array|*}
 */
export const activatePictureRef = (imageRef, props) => {
  const convertedProps = convertProps(props)
  if (
    typeof window !== `undefined` &&
    (typeof convertedProps.fluid !== `undefined` ||
      typeof convertedProps.fixed !== `undefined`)
  ) {
    if (hasImageArray(convertedProps)) {
      return activateMultiplePictureRefs(imageRef, props)
    } else {
      const imageData = convertedProps.fluid
        ? convertedProps.fluid
        : convertedProps.fixed

      // Prevent adding HTMLPictureElement if it isn't supported (e.g. IE11),
      // but don't prevent it during SSR.
      if (hasPictureElement()) {
        const pic = document.createElement('picture')
        if (imageData.srcSetWebp) {
          const sourcesWebP = document.createElement('source')
          sourcesWebP.type = `image/webp`
          sourcesWebP.srcset = imageData.srcSetWebp
          sourcesWebP.sizes = imageData.sizes
          pic.appendChild(sourcesWebP)
        }
        pic.appendChild(imageRef)
      }

      imageRef.srcset = imageData.srcSet ? imageData.srcSet : ``
      imageRef.src = imageData.src ? imageData.src : ``

      return imageRef
    }
  }
  return null
}

/**
 * Creates multiple picture elements.
 *
 * @param imageRefs
 * @param props
 * @return {Array||null}
 */
export const activateMultiplePictureRefs = (imageRefs, props) => {
  const convertedProps = convertProps(props)

  // Extract Image Array.
  return imageRefs.map((imageRef, index) => {
    if (convertedProps.fluid) {
      return activatePictureRef(imageRef, {
        ...convertedProps,
        fluid: convertedProps.fluid[index],
      })
    } else {
      return activatePictureRef(imageRef, {
        ...convertedProps,
        fixed: convertedProps.fixed[index],
      })
    }
  })
}

/**
 * Create basic image for a noscript event.
 *
 * @param props
 * @return {string}
 */
export const noscriptImg = props => {
  // Check if prop exists before adding each attribute to the string output below to prevent
  // HTML validation issues caused by empty values like width="" and height=""
  const src = props.src ? `src="${props.src}" ` : `src="" ` // required attribute
  const sizes = props.sizes ? `sizes="${props.sizes}" ` : ``
  const srcSetWebp = props.srcSetWebp
    ? `<source type='image/webp' srcset="${props.srcSetWebp}" ${sizes}/>`
    : ``
  const srcSet = props.srcSet ? `srcset="${props.srcSet}" ` : ``
  const title = props.title ? `title="${props.title}" ` : ``
  const alt = props.alt ? `alt="${props.alt}" ` : `alt="" ` // required attribute
  const width = props.width ? `width="${props.width}" ` : ``
  const height = props.height ? `height="${props.height}" ` : ``
  const opacity = props.opacity ? props.opacity : `1`
  const transitionDelay = props.transitionDelay ? props.transitionDelay : `0.5s`
  const crossOrigin = props.crossOrigin
    ? `crossorigin="${props.crossOrigin}" `
    : ``
  // Prevent adding HTMLPictureElement if it isn't supported (e.g. IE11),
  // but don't prevent it during SSR.

  const innerImage = `<img ${width}${height}${sizes}${srcSet}${src}${alt}${title}${crossOrigin}style="position:absolute;top:0;left:0;z-index:-1;transition:opacity 0.5s;transition-delay:${transitionDelay};opacity:${opacity};width:100%;height:100%;object-fit:cover;object-position:center"/>`
  return hasPictureElement()
    ? `<picture>${srcSetWebp}${innerImage}</picture>`
    : innerImage
}

/**
 * Compares the old states to the new and changes image settings accordingly.
 *
 * @param image     string||array   Base data for one or multiple Images.
 * @param bgImage   string||array   Last background image(s).
 * @param imageRef  string||array   References to one or multiple Images.
 * @param state     object          Component state.
 * @return {{afterOpacity: number, bgColor: *, bgImage: *, nextImage: string}}
 */
export const switchImageSettings = ({ image, bgImage, imageRef, state }) => {
  // Read currentSrc from imageRef (if exists).
  const currentSources = getCurrentFromData({
    data: imageRef,
    propName: `currentSrc`,
  })
  // Backup bgImage to lastImage.
  // TODO: perhaps use bgImage & lastImage as an array and introduce:
  // TODO: - gbImageString & lastImageString
  // TODO: might help with the suddenly "missing" astronaut ^^.
  // TODO: use imageReferenceCompleted() for "src" & "currentSrc", else fill in from lastImage.
  const returnArray = Array.isArray(image)
  const lastImage = Array.isArray(bgImage) ? filteredJoin(bgImage) : bgImage
  // Set the backgroundImage according to images available.
  let nextImage
  let nextImageArray
  if (returnArray) {
    // Check for tracedSVG first.
    nextImage = getCurrentFromData({
      data: image,
      propName: `tracedSVG`,
      returnArray,
    })
    // Now combine with base64 images.
    nextImage = combineArray(
      getCurrentFromData({
        data: image,
        propName: `base64`,
        returnArray,
      }),
      nextImage
    )
    // Do we have at least one img loaded?
    if (state.imgLoaded && state.isVisible) {
      if (currentSources) {
        nextImage = combineArray(
          getCurrentFromData({
            data: imageRef,
            propName: `currentSrc`,
            returnArray,
          }),
          nextImage
        )
      } else {
        // Should we still have no nextImage it might be because currentSrc is missing.
        nextImage = combineArray(
          getCurrentFromData({
            data: imageRef,
            propName: `src`,
            returnArray,
          }),
          nextImage
        )
      }
    }
    // TODO : cross reference with lastImage / bgImage array.
    // First fill last images from bgImage...
    console.log(`before:`, nextImage)
    nextImage = combineArray(nextImage, bgImage)
    // ... then fill the rest of the background-images with a transparent dummy
    // pixel, lest the background-* properties can't target the correct image.
    const dummyArray = createDummyImageArray(image.length)
    // Now combine the two arrays and join them.
    nextImage = combineArray(nextImage, dummyArray)
    nextImageArray = nextImage
    console.log(`after:`, nextImage)
    nextImage = filteredJoin(nextImage)
  } else {
    nextImage = ``
    if (image.tracedSVG)
      nextImage = getCurrentFromData({ data: image, propName: `tracedSVG` })
    if (image.base64 && !image.tracedSVG)
      nextImage = getCurrentFromData({ data: image, propName: `base64` })
    if (state.imgLoaded && state.isVisible) {
      nextImage =
        currentSources ||
        getCurrentFromData({
          data: imageRef,
          propName: `src`,
        })
    }
  }

  // Fall back on lastImage (important for prop changes) if all else fails.
  if (!nextImage) nextImage = lastImage
  // Change opacity according to imageState.
  const afterOpacity = state.imageState % 2

  const newImageSettings = {
    lastImage,
    nextImage,
    afterOpacity,
  }
  // Add nextImageArray for bgImage to newImageSettings if exists.
  if (nextImageArray) newImageSettings.nextImageArray = nextImageArray
  return newImageSettings
}

/**
 * Extracts a value from an imageRef or image object or an array of them.
 *
 * @param data
 * @param propName
 * @param addUrl
 * @param returnArray
 * @return {string||array}
 */
export const getCurrentFromData = ({
  data,
  propName,
  addUrl = true,
  returnArray = false,
}) => {
  if (!data || !propName) return ``
  // Handle tracedSVG with "special care".
  const tracedSVG = propName === `tracedSVG`
  if (Array.isArray(data)) {
    // Filter out all elements not having the propName and return remaining.
    const imageString = data
      // .filter(dataElement => {
      //   return propName in dataElement && dataElement[propName]
      // })
      .map(dataElement => {
        // If `currentSrc` is needed, check image load completion first.
        if (propName === `currentSrc`) {
          return (imageLoaded(dataElement) && dataElement[propName]) || ``
        }
        return dataElement[propName] || ``
      })
    // Encapsulate in URL string and return.
    return getUrlString({
      imageString,
      tracedSVG,
      addUrl,
      returnArray,
    })
  } else {
    return propName in data
      ? getUrlString({ imageString: data[propName], tracedSVG, addUrl })
      : ``
  }
}

/**
 * Encapsulates an imageString with a url if needed.
 *
 * @param imageString   string    String to encapsulate.
 * @param tracedSVG     boolean   Special care for SVGs.
 * @param addUrl        boolean   If the string should be encapsulated or not.
 * @param returnArray   boolean   Return concatenated string or Array.
 * @return {string||array}
 */
export const getUrlString = ({
  imageString,
  tracedSVG = false,
  addUrl = true,
  returnArray = false,
}) => {
  if (Array.isArray(imageString)) {
    const stringArray = imageString.map(currentString => {
      const currentReturnString =
        tracedSVG && currentString ? `"${currentString}"` : currentString
      return addUrl && currentString
        ? `url(${currentReturnString})`
        : currentReturnString
    })
    return returnArray ? stringArray : filteredJoin(stringArray)
  } else {
    const returnString =
      tracedSVG && imageString ? `"${imageString}"` : imageString
    return imageString ? (addUrl ? `url(${returnString})` : returnString) : ``
  }
}

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
  } else {
    // Are the lengths or sources in the Arrays different?
    if (isPropsFluidArray && isPrevPropsFluidArray) {
      if (props.fluid.length === prevProps.fluid.length) {
        return props.fluid.every(
          (image, index) => image.src !== prevProps.fluid[index].src
        )
      }
      return true
    } else if (isPropsFixedArray && isPrevPropsFixedArray) {
      if (props.fixed.length === prevProps.fixed.length) {
        return props.fixed.every(
          (image, index) => image.src !== prevProps.fixed[index].src
        )
      }
      return true
    }
  }
}

export const initialBgImage = (props, withDummies = true) => {
  const convertedProps = convertProps(props)
  const image = convertedProps.fluid || convertedProps.fixed
  // TODO: Check if image exists!!
  const returnArray = hasImageArray(convertedProps)
  let initialImage
  if (returnArray) {
    // Check for tracedSVG first.
    initialImage = getCurrentFromData({
      data: image,
      propName: `tracedSVG`,
      returnArray,
    })
    // Now combine with base64 images.
    initialImage = combineArray(
      getCurrentFromData({
        data: image,
        propName: `base64`,
        returnArray,
      }),
      initialImage
    )
    if (withDummies) {
      const dummyArray = createDummyImageArray(image.length)
      // Now combine the two arrays and join them.
      initialImage = combineArray(initialImage, dummyArray)
    }
  } else {
    initialImage = ``
    if (image.tracedSVG)
      initialImage = getCurrentFromData({ data: image, propName: `tracedSVG` })
    if (image.base64 && !image.tracedSVG)
      initialImage = getCurrentFromData({ data: image, propName: `base64` })
  }
  return initialImage
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
 * Checks if an image (array) reference is existing and tests for complete.
 *
 * @param imageRef    HTMLImageElement||array   Image reference(s).
 * @return {boolean}
 */
export const imageReferenceCompleted = imageRef =>
  imageRef
    ? Array.isArray(imageRef)
      ? imageRef.every(singleImageRef => imageLoaded(singleImageRef))
      : imageLoaded(imageRef)
    : false

export const imageLoaded = imageRef =>
  imageRef ? imageRef.complete && imageRef.naturalWidth !== 0 : false
