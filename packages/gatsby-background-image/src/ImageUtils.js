import { combineArray, convertProps, filteredJoin } from './HelperUtils'

const DUMMY_IMG = `data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==`

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
  if (
    (convertedProps.fluid && Array.isArray(convertedProps.fluid)) ||
    (convertedProps.fixed && Array.isArray(convertedProps.fixed))
  ) {
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
  if (
    (convertedProps.fluid && Array.isArray(convertedProps.fluid)) ||
    (convertedProps.fixed && Array.isArray(convertedProps.fixed))
  ) {
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
    if (
      (convertedProps.fluid && Array.isArray(convertedProps.fluid)) ||
      (convertedProps.fixed && Array.isArray(convertedProps.fixed))
    ) {
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
    if (
      (convertedProps.fluid && Array.isArray(convertedProps.fluid)) ||
      (convertedProps.fixed && Array.isArray(convertedProps.fixed))
    ) {
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
 * @param bgImage   string          Last background-image string.
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
  const lastImage = bgImage
  const returnArray = Array.isArray(image)
  // Set the backgroundImage according to images available.
  let nextImage
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
    // Fill the rest of the background-images with a transparent dummy pixel,
    // lest the other background-* properties can't target the correct image.
    const dummyImageURI = getUrlString({ imageString: DUMMY_IMG })
    const dummyArray = Array(image.length).fill(dummyImageURI)

    // Now combine the two arrays and join them.
    nextImage = filteredJoin(combineArray(nextImage, dummyArray))
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

  return {
    lastImage,
    nextImage,
    afterOpacity,
  }
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
      .map(dataElement => dataElement[propName] || ``)
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
  // Did the props change to a single image?
  (Array.isArray(props.fluid) && !Array.isArray(prevProps.fluid)) ||
  (Array.isArray(props.fixed) && !Array.isArray(prevProps.fixed)) ||
  // Did the props change to an Array?
  (!Array.isArray(props.fluid) && Array.isArray(prevProps.fluid)) ||
  (!Array.isArray(props.fixed) && Array.isArray(prevProps.fixed)) ||
  // Are the first sources in the Arrays different?
  // TODO: loop through array and check individually!
  (Array.isArray(props.fluid) &&
    Array.isArray(prevProps.fluid) &&
    props.fluid[0].src !== prevProps.fluid[0].src) ||
  (Array.isArray(props.fixed) &&
    Array.isArray(prevProps.fixed) &&
    props.fixed[0].src !== prevProps.fixed[0].src) ||
  // Are single image sources different?
  (props.fluid && prevProps.fluid && props.fluid.src !== prevProps.fluid.src) ||
  (props.fixed && prevProps.fixed && props.fixed.src !== prevProps.fixed.src)

/**
 * Checks if an image (array) reference is existing and tests for complete.
 * @param imageRef    HTMLImageElement||array   Image reference(s).
 */
export const imageReferenceCompleted = imageRef =>
  imageRef
    ? Array.isArray(imageRef)
      ? imageRef.every(singleImageRef => singleImageRef.complete)
      : imageRef.complete
    : false

// {
//   if (imageRef) {
//     if (Array.isArray(imageRef)) {
//       return imageRef.every(singleImageRef => singleImageRef.complete)
//     }
//     return imageRef.complete
//   }
// }
