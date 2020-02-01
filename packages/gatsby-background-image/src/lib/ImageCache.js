import { convertProps } from './HelperUtils'
import { hasArtDirectionArray } from './MediaUtils'
import { getImageSrcKey, getSelectedImage, hasImageArray } from './ImageUtils'
import { deleteOldCaches, getData, setData } from './CacheStorage'

const imageCache = Object.create({})
/**
 * Cache if we've seen an image before so we don't bother with
 * lazy-loading & fading in on subsequent mounts.
 *
 * @param props
 * @param index
 * @param isLoop
 * @return {boolean}
 */
export const inImageCache = async (props, index = 0, isLoop = false) => {
  const convertedProps = convertProps(props)
  const isImageStack =
    hasImageArray(convertedProps) && !hasArtDirectionArray(convertedProps)
  if (isImageStack && !isLoop) {
    return allInImageCache(props)
  }

  // Find src
  const src = isImageStack
    ? getSelectedImage(convertedProps, index)
    : getImageSrcKey(convertedProps)
  const cachedSrc = await getData(src)
  console.log('cachedSrc', cachedSrc)
  return !!cachedSrc || imageCache[src] || false
}

/**
 * Processes an image stack with inImageCache.
 *
 * @param props  object    Component Props (with fluid or fixed as array).
 * @return {*|boolean}
 */
export const allInImageCache = props => {
  const convertedProps = convertProps(props)
  // Extract Image Array.
  const imageStack = convertedProps.fluid || convertedProps.fixed
  // Only return true if every image is in cache.
  return imageStack.every(
    async (imageData, index) => await inImageCache(convertedProps, index, true)
  )
}

/**
 * Adds an Image to imageCache.
 *
 * @param props
 * @param index
 * @param isLoop
 */
export const activateCacheForImage = (props, index = 0, isLoop = false) => {
  const convertedProps = convertProps(props)
  const isImageStack =
    hasImageArray(convertedProps) && !hasArtDirectionArray(convertedProps)
  if (isImageStack && !isLoop) {
    return activateCacheForMultipleImages(props)
  }
  // Find src
  const src = isImageStack
    ? getSelectedImage(convertedProps, index)
    : getImageSrcKey(convertedProps)
  if (src) {
    setData(src)
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
  imageStack.forEach((imageData, index) =>
    activateCacheForImage(convertedProps, index, true)
  )
}

/**
 * Resets the image cache (especially important for reliable tests).
 */
export const resetImageCache = () => {
  deleteOldCaches()
  for (const prop in imageCache) delete imageCache[prop]
}
