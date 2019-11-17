import { isBrowser } from './HelperUtils'

/**
 * Return an array ordered by elements having a media prop, does not use
 * native sort, as a stable sort is not guaranteed by all browsers/versions
 *
 * @param imageVariants   array   The art-directed images.-
 */
export const groupByMedia = imageVariants => {
  const withMedia = []
  const without = []
  imageVariants.forEach(variant =>
    (variant.media ? withMedia : without).push(variant)
  )

  if (without.length > 1 && process.env.NODE_ENV !== `production`) {
    console.warn(
      `We've found ${without.length} sources without a media property. They might be ignored by the browser, see: https://www.gatsbyjs.org/packages/gatsby-image/#art-directing-multiple-images`
    )
  }

  return [...withMedia, ...without]
}

/**
 * Creates a source Array from media objects.
 *
 * @param fluid
 * @param fixed
 * @return {*}
 */
export const createArtDirectionSources = ({ fluid, fixed }) => {
  const currentSource = fluid || fixed
  return currentSource.map(image => {
    const source = document.createElement('source')
    source.srcset = image.srcSet
    source.sizes = image.sizes
    if (image.srcSetWebp) {
      source.type = `image/webp`
      source.srcset = image.srcSetWebp
    }
    if (image.media) {
      source.media = image.media
    }
    return source
  })
}

/**
 * Checks if fluid or fixed are art-direction arrays.
 *
 * @param props   object   The props to check for images.
 * @return {boolean}
 */
export const hasArtDirectionFluidArray = props =>
  props.fluid &&
  Array.isArray(props.fluid) &&
  props.fluid.some(fluidImage => typeof fluidImage.media !== 'undefined')

/**
 * Checks if fluid or fixed are art-direction arrays.
 *
 * @param props   object   The props to check for images.
 * @return {boolean}
 */
export const hasArtDirectionFixedArray = props =>
  props.fixed &&
  Array.isArray(props.fixed) &&
  props.fixed.some(fixedImage => typeof fixedImage.media !== 'undefined')

/**
 * Checks for fluid or fixed Art direction support.
 * @param props
 * @return {boolean}
 */
export const hasArtDirectionArray = props =>
  hasArtDirectionFluidArray(props) || hasArtDirectionFixedArray(props)

/**
 * Tries to detect if a media query matches the current viewport.
 *
 * @param media   string  A media query string.
 * @return {*|boolean}
 */
export const matchesMedia = ({ media }) =>
  media && isBrowser() && window.matchMedia(media).matches
