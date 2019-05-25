import { convertProps } from './HelperUtils'

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
    (convertedProps.fluid && Array.isArray(convertedProps.fluid))
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
 * @param props
 * @return {*|boolean}
 */
export const allInImageCache = props => {
  const convertedProps = convertProps(props)
  // Extract Image Array.
  const imageStack = convertedProps.fluid || convertedProps.fixed || []
  // Only return true if every image is in cache.
  return imageStack.every(imageData => {
    if (convertedProps.fluid) {
      return inImageCache({ fluid: imageData })
    }
    if (convertedProps.fixed) {
      return inImageCache({ fixed: imageData })
    }
    return false
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
    (convertedProps.fluid && Array.isArray(convertedProps.fluid))
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
  const imageStack = convertedProps.fluid || convertedProps.fixed || []
  imageStack.forEach(imageData => {
    if (convertedProps.fluid) {
      activateCacheForImage({ fluid: imageData })
    }
    if (convertedProps.fixed) {
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
      (convertedProps.fluid && Array.isArray(convertedProps.fluid))
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
 * Creates multiple image references.
 *
 * @param props
 * @param onLoad
 */
export const createMultiplePictureRefs = (props, onLoad) => {
  const convertedProps = convertProps(props)
  if (
    typeof window !== `undefined` &&
    (typeof convertedProps.fluid !== `undefined` ||
      typeof convertedProps.fixed !== `undefined`) &&
    (Array.isArray(convertedProps.fluid) || Array.isArray(convertedProps.fixed))
  ) {
    // Extract Image Array.
    const imageStack = convertedProps.fluid || convertedProps.fixed || []
    return imageStack.map(imageData => {
      if (convertedProps.fluid) {
        return createPictureRef({ ...convertedProps, fluid: imageData }, onLoad)
      }
      if (convertedProps.fixed) {
        return createPictureRef({ ...convertedProps, fixed: imageData }, onLoad)
      }
    })
  }
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
      (convertedProps.fluid && Array.isArray(convertedProps.fluid))
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
  if (
    typeof window !== `undefined` &&
    (typeof convertedProps.fluid !== `undefined` ||
      typeof convertedProps.fixed !== `undefined`) &&
    (Array.isArray(convertedProps.fluid) || Array.isArray(convertedProps.fixed))
  ) {
    // Extract Image Array.
    return imageRefs.map((imageRef, index) => {
      if (convertedProps.fluid) {
        return activatePictureRef(imageRef, {
          ...convertedProps,
          fluid: convertedProps.fluid[index],
        })
      }
      if (convertedProps.fixed) {
        return activatePictureRef(imageRef, {
          ...convertedProps,
          fixed: convertedProps.fixed[index],
        })
      }
    })
  }
  return null
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
 * @param image
 * @param bgImage
 * @param imageRef
 * @param state
 * @return {{noBase64: boolean, afterOpacity: number, bgColor: *, bgImage: *, nextImage: string}}
 */
export const switchImageSettings = ({ image, bgImage, imageRef, state }) => {
  const noBase64 = !image.base64
  // Set the backgroundImage according to images available.
  let nextImage = ``
  if (image.tracedSVG) nextImage = `"${image.tracedSVG}"`
  if (image.base64 && !image.tracedSVG) nextImage = image.base64
  if (state.imgLoaded && state.isVisible)
    nextImage = (imageRef && imageRef.currentSrc) || ``

  // Switch bgImage & nextImage and opacity accordingly.
  const lastImage = bgImage
  // Change opacity according to imageState.
  const afterOpacity = state.imageState % 2
  // Should we still have no nextImage it might be because currentSrc is missing.
  if (
    nextImage === `` &&
    state.imgLoaded &&
    state.isVisible &&
    imageRef &&
    !imageRef.currentSrc
  ) {
    nextImage = imageRef.src
  }
  // Fall back on lastImage (important for prop changes) if all else fails.
  if (nextImage === ``) nextImage = lastImage

  return {
    lastImage,
    nextImage,
    afterOpacity,
    noBase64,
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
  // Did the props change to an Array?
  (Array.isArray(props.fluid) && !Array.isArray(prevProps.fluid)) ||
  (Array.isArray(props.fixed) && !Array.isArray(prevProps.fixed)) ||
  // Did the props change to a single image?
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
