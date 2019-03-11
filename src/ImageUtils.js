import { convertProps } from './HelperUtils'

/**
 * Create lazy image loader with Image().
 *
 * @param props
 * @return {*}
 * @public
 */
export const createImageToLoad = props => {
  if (typeof window !== `undefined`) {
    const convertedProps = convertProps(props)

    const img = new Image()
    if (!img.complete && typeof convertedProps.onLoad === `function`) {
      img.addEventListener('load', convertedProps.onLoad)
    }
    if (typeof convertedProps.onError === `function`) {
      img.addEventListener('error', convertedProps.onError)
    }
    // Find src
    img.src = convertedProps.fluid
        ? convertedProps.fluid.src
        : convertedProps.fixed.src
    return img
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
  return `<picture>${srcSetWebp}<img ${width}${height}${sizes}${srcSet}${src}${alt}${title}style="position:absolute;top:0;left:0;transition:opacity 0.5s;transition-delay:${transitionDelay};opacity:${opacity};width:100%;height:100%;object-fit:cover;object-position:center"/></picture>`
}