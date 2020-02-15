import {
  escapeClassNames,
  kebabifyBackgroundStyles,
  setTransitionStyles,
} from './StyleUtils'
import { getCurrentFromData, getUrlString, hasImageArray } from './ImageUtils'
import { hasArtDirectionArray } from './MediaUtils'
import {
  combineArray,
  filteredJoin,
  isBrowser,
  stringToArray,
} from './SimpleUtils'

/**
 * Creates pseudo-element(s) for className(s).
 *
 * @param className string  className given by props
 * @param classId   string  Deprecated classId
 * @param appendix  string  Pseudo-element to create, defaults to `:before`
 * @return {string}
 */
export const createPseudoElement = (
  className,
  classId = ``,
  appendix = `:before`
) => {
  const escapedClassName = escapeClassNames(className)
  let classes = stringToArray(escapedClassName)
  let pseudoClasses = ``
  if (Array.isArray(classes)) {
    classes = classes.filter(c => c !== '')
    if (classes.length > 0) {
      pseudoClasses = `.${classes.join('.')}${appendix}`
    }
  }
  if (classId !== ``) {
    pseudoClasses += `${pseudoClasses &&
      `,\n`}.gatsby-background-image-${classId}${appendix}`
  }
  return pseudoClasses
}

/**
 * Creates a single pseudo-element with image content.
 *
 * @param pseudoElementString   string    The current pseudo-element name.
 * @param imageSource           string    The current image source.
 * @return {string}
 */
export const createPseudoElementWithContent = (
  pseudoElementString,
  imageSource
) => {
  return `
    ${pseudoElementString} {
      opacity: 1;
      background-image: ${imageSource};
    }`
}

/**
 * Creates a single pseudo-element media-query.
 *
 * @param pseudoElementString
 * @param media
 * @param imageSource
 * @param imageSourceWebP
 * @return {string}
 */
export const createPseudoElementMediaQuery = (
  pseudoElementString,
  media,
  imageSource,
  imageSourceWebP
) => `
      @media ${media} {
        ${createPseudoElementWithContent(pseudoElementString, imageSource)}
      }
      ${imageSourceWebP &&
        `@media ${media} {
          ${createPseudoElementWithContent(
            pseudoElementString,
            imageSourceWebP
          )}
        }`}
    `

/**
 * Creates styles for the changing pseudo-elements' backgrounds.
 *
 * @param classId           string    Pre 0.3.0 way to create pseudo-elements
 * @param className         string    One or more className(s)
 * @param transitionDelay   string    Time delay before transitioning
 * @param lastImage         string    The last image given
 * @param nextImage         string    The next image to show
 * @param afterOpacity      number    The opacity of the pseudo-element upfront
 * @param bgColor           string    A possible background-color to set
 * @param fadeIn            boolean   Should we transition?
 * @param backgroundStyles  object    Special background styles to be spread
 * @param style             object    Default style to be spread
 * @param finalImage        boolean   Have we reached the last image?
 * @param originalData
 * @return {string}
 */
export const createPseudoStyles = ({
  classId,
  className,
  transitionDelay,
  lastImage,
  nextImage,
  afterOpacity,
  bgColor,
  fadeIn,
  backgroundStyles,
  style,
  finalImage,
  originalData,
}) => {
  const pseudoBefore = createPseudoElement(className, classId)
  const pseudoAfter = createPseudoElement(className, classId, `:after`)
  return `
          ${pseudoBefore},
          ${pseudoAfter} {
            content: '';
            display: block;
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            ${bgColor && `background-color: ${bgColor};`}
            ${setTransitionStyles(transitionDelay, fadeIn)}
            ${kebabifyBackgroundStyles({ ...backgroundStyles, ...style })}
          }
          ${pseudoBefore} {
            z-index: -100;
            ${(afterOpacity && createStyleImage(nextImage, originalData)) || ``}
            ${(!afterOpacity && createStyleImage(lastImage, originalData)) ||
              ``}
            opacity: ${afterOpacity}; 
          }
          ${pseudoAfter} {
            z-index: -101;
            ${(!afterOpacity && createStyleImage(nextImage, originalData)) ||
              ``}
            ${(afterOpacity && createStyleImage(lastImage, originalData)) || ``}
            ${finalImage ? `opacity: ${Number(!afterOpacity)};` : ``}
          }
        `
}

/**
 * Creates a background-image string when certain conditions are met.
 *
 * @param image                   {string}  The current image.
 * @param originalData            {Object}  The original fluid or fixed image.
 * @return {string}
 */
export const createStyleImage = (image, originalData) => {
  const hasStackedImages =
    hasImageArray({ fluid: originalData }) &&
    !hasArtDirectionArray({ fluid: originalData })
  if (isBrowser() || hasStackedImages) {
    return image ? `background-image: ${image};` : ``
  }
  return ``
}

/**
 * Creates styles for the noscript element.
 *
 * @param classId     string          Pre 0.3.0 way to create pseudo-elements
 * @param className   string          One or more className(s)
 * @param image       string||array   Base data for one or multiple Images
 * @return {string}
 */
export const createNoScriptStyles = ({ classId, className, image }) => {
  if (image) {
    const returnArray =
      Array.isArray(image) && !hasArtDirectionArray({ fluid: image })
    const addUrl = false
    const allSources = getCurrentFromData({
      data: image,
      propName: `src`,
      checkLoaded: false,
      addUrl,
      returnArray,
    })
    const sourcesAsUrl = getUrlString({
      imageString: allSources,
      hasImageUrls: true,
      returnArray,
    })
    let sourcesAsUrlWithCSS = ``
    if (returnArray) {
      const cssStrings = getCurrentFromData({
        data: image,
        propName: `CSS_STRING`,
        addUrl: false,
        returnArray,
      })
      sourcesAsUrlWithCSS = filteredJoin(combineArray(sourcesAsUrl, cssStrings))
    }
    const pseudoBefore = createPseudoElement(className, classId)
    if (hasArtDirectionArray({ fluid: image })) {
      return image
        .map(currentMedia => {
          const sourceString = getUrlString({ imageString: currentMedia.src })
          const webPString = getUrlString({
            imageString: currentMedia.srcWebp || ``,
          })
          if (currentMedia.media) {
            return createPseudoElementMediaQuery(
              pseudoBefore,
              currentMedia.media,
              sourceString,
              webPString
            )
          }
          return ``
        })
        .join('')
    }
    return createPseudoElementWithContent(
      pseudoBefore,
      sourcesAsUrlWithCSS || sourcesAsUrl
    )
  }
  return ``
}
