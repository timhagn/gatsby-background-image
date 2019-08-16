import {
  convertProps,
  filteredJoin,
  hashString,
  isString,
  stringToArray,
  toKebabCase,
} from './HelperUtils'
import { getCurrentFromData, getUrlString } from './ImageUtils'
import { combineArray } from './HelperUtils'

const componentClassCache = Object.create({})
/**
 * Cache component classes as we never know if a Component wasn't already set.
 * @param className
 * @return {*|boolean}
 */
export const inComponentClassCache = className => {
  return componentClassCache[className] || false
}

/**
 * Adds a component's classes to componentClassCache.
 * @param className
 */
export const activateCacheForComponentClass = className => {
  if (className) {
    componentClassCache[className] = true
  }
}

/**
 * Resets the componentClassCache (especially important for reliable tests).
 */
export const resetComponentClassCache = () => {
  for (const className in componentClassCache)
    delete componentClassCache[className]
}

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
  const classes = stringToArray(className)
  let pseudoClasses = ``
  if (classes instanceof Array && classes.length > 0 && classes[0] !== ``) {
    pseudoClasses = `.${classes.join('.')}${appendix}`
  }
  if (classId !== ``) {
    pseudoClasses += `${pseudoClasses &&
      `,\n`}.gatsby-background-image-${classId}${appendix}`
  }
  return pseudoClasses
}

/**
 * Checks if an element with given className(s) already exists.
 * @param className       string    Given className(s) e.g. from styled-components.
 * @param addedClassName  string    A possible previously added className.
 * @param props
 * @return {*[]}
 */
export const fixClassName = ({ className, addedClassName = ``, ...props }) => {
  const convertedProps = convertProps(props)
  const elementExists = inComponentClassCache(className)

  // Extract imageData.
  const imageData = convertedProps.fluid
    ? Array.isArray(convertedProps.fluid)
      ? convertedProps.fluid[0]
      : convertedProps.fluid
    : Array.isArray(convertedProps.fixed)
    ? convertedProps.fixed[0]
    : convertedProps.fixed

  // Really just the answer to issue #55 ; ).
  const randomAnswerToLifeTheUniverseAndEverything = addedClassName
    ? addedClassName
    : Math.round(Math.random() * 42)

  // Create random "uniquely hashed" additionalClass if needed.
  const randomClass = ` gbi-${hashString(
    (imageData && imageData.srcSet) || className
  )}-${randomAnswerToLifeTheUniverseAndEverything}`

  // Should an element exist, add randomized class.
  const additionalClass = elementExists ? randomClass : ``
  const componentClassNames = `${className || ``}${additionalClass ||
    ``}`.trim()
  // Add it to cache if it doesn't exist.
  !elementExists && activateCacheForComponentClass(className)
  return [componentClassNames, additionalClass]
}

/**
 * Converts a style object into CSS kebab-cased style rules.
 *
 * @param styles
 * @return {*}
 */
export const kebabifyBackgroundStyles = styles => {
  if (isString(styles)) {
    return styles
  }
  if (styles instanceof Object) {
    return Object.keys(styles)
      .filter(key => key.indexOf('background') === 0 && styles[key] !== '')
      .reduce(
        (resultingStyles, key) =>
          `${resultingStyles}${toKebabCase(key)}: ${styles[key]};\n`,
        ``
      )
  }
  return ``
}

/**
 * Creates vendor prefixed background styles.
 *
 * @param transitionDelay
 * @param fadeIn
 * @return {string}
 */
export const setTransitionStyles = (transitionDelay = `0.25s`, fadeIn = true) =>
  fadeIn
    ? `transition: opacity 0.5s ease ${transitionDelay};`
    : `transition: none;`

/**
 * Prevent possible stacking order mismatch with opacity "hack".
 *
 * @param props
 * @return {Object}
 */
export const fixOpacity = props => {
  const styledProps = { ...props }

  if (!styledProps.preserveStackingContext) {
    try {
      if (styledProps.style && styledProps.style.opacity) {
        if (
          isNaN(styledProps.style.opacity) ||
          styledProps.style.opacity > 0.99
        ) {
          styledProps.style.opacity = 0.99
        }
      }
    } catch (e) {
      // Continue regardless of error
    }
  }

  return styledProps
}

/**
 * Set some needed backgroundStyles.
 *
 * @param backgroundStyles
 * @return {Object}
 */
export const presetBackgroundStyles = backgroundStyles => {
  const defaultBackgroundStyles = {
    backgroundPosition: `center`,
    backgroundRepeat: `no-repeat`,
    backgroundSize: `cover`,
  }

  return { ...defaultBackgroundStyles, ...backgroundStyles }
}

/**
 * Creates styles for the changing pseudo-elements' backgrounds.
 *
 * @param classId           string    Pre 0.3.0 way to create pseudo-elements
 * @param className         string    One or more className(s)
 * @param transitionDelay   string
 * @param lastImage         string
 * @param nextImage         string
 * @param afterOpacity      number
 * @param bgColor           string
 * @param fadeIn            boolean
 * @param backgroundStyles  object
 * @param style             object
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
            ${
              afterOpacity && nextImage ? `background-image: ${nextImage};` : ``
            }
            ${
              !afterOpacity && lastImage
                ? `background-image: ${lastImage};`
                : ``
            }
            opacity: ${afterOpacity}; 
          }
          ${pseudoAfter} {
            z-index: -101;
            ${
              !afterOpacity && nextImage
                ? `background-image: ${nextImage};`
                : ``
            }
            ${
              afterOpacity && lastImage ? `background-image: ${lastImage};` : ``
            }
          }
        `
}

/**
 * Creates styles for the noscript element.
 *
 * @param classId     string          Pre 0.3.0 way to create pseudo-elements
 * @param className   string          One or more className(s)
 * @param image       string||array   Base data for one or multiple Images.
 * @return {string}
 */
export const createNoScriptStyles = ({ classId, className, image }) => {
  if (image) {
    const returnArray = Array.isArray(image)
    const addUrl = false
    const allSources = getCurrentFromData({
      data: image,
      propName: `src`,
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
    return `
          ${pseudoBefore} {
            opacity: 1;
            background-image: ${sourcesAsUrlWithCSS || sourcesAsUrl};
          }`
  }
  return ``
}
