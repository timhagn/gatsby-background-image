import {
  convertProps,
  hasImageArray,
} from './HelperUtils'
import { hasArtDirectionArray } from './MediaUtils'
import { getImageSrcKey } from './ImageUtils'

const imageCache = Object.create({})
/**
 * Cache if we've seen an image before so we don't both with
 * lazy-loading & fading in on subsequent mounts.
 *
 * @param props
 * @return {boolean}
 */
export const inImageCache = props => {
  const convertedProps = convertProps(props)
  if (hasImageArray(convertedProps) && !hasArtDirectionArray(convertedProps)) {
    return allInImageCache(props)
  }

  // Find src
  const src = getImageSrcKey(convertedProps)
  return imageCache[src] || false
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
    }
    return inImageCache({ fixed: imageData })
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
  }
  // Find src
  const src = getImageSrcKey(convertedProps)
  if (src) {
    imageCache[src] = true
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
