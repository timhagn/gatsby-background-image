import uuid from 'short-uuid'
import { convertProps } from './HelperUtils'
import {
  activateCacheForComponentClass,
  inComponentClassCache,
} from './ClassCache'
import { getCurrentSrcData } from './ImageUtils'
import { hashString, isBrowser, isString, toKebabCase } from './SimpleUtils'

/**
 * Checks if an element with given className(s) already exists.
 *
 * @param className       string    Given className(s) e.g. from styled-components
 * @param props           Object    Given props by component
 * @return {*[]}
 */
export const fixClassName = ({ className, ...props }) => {
  // const escapedClassName = escapeClassNames(className)
  const convertedProps = convertProps(props)
  const elementExists = inComponentClassCache(className)

  // Extract imageData.
  const imageData = getCurrentSrcData(convertedProps)

  // Add an additional unique class for multiple <BackgroundImage>s.
  const additionalClassname = uuid.generate()

  // Create random "uniquely hashed" additionalClass if needed.
  const randomClass = ` gbi-${hashString(
    (imageData && imageData.srcSet) || className || `noclass`
  )}-${additionalClassname}`

  // Should an element already exist or have no className, add randomized class.
  const additionalClass = elementExists || !className ? randomClass : ``
  const componentClassNames = `${className || ``}${
    additionalClass || ``
  }`.trim()
  // Add it to cache if it doesn't exist.
  if (!elementExists) activateCacheForComponentClass(className)
  return [componentClassNames]
}

/**
 * Escapes specialChars defined in gatsby-config.js in classNames to make
 * Tailwind CSS or suchlike usable (defaults to: `:/`).
 *
 * @param classNames           classNames to escape.
 * @return {void | string|*}
 */
export const escapeClassNames = classNames => {
  /* eslint-disable no-undef */
  if (classNames) {
    const specialChars =
      // eslint-disable-next-line no-undef
      isBrowser() && window._gbiSpecialChars
        ? window._gbiSpecialChars
        : typeof __GBI_SPECIAL_CHARS__ !== `undefined`
        ? __GBI_SPECIAL_CHARS__
        : ':/'
    const specialCharRegEx = new RegExp(`[${specialChars}]`, 'g')
    return classNames.replace(specialCharRegEx, '\\$&')
  }
  return classNames
  /* eslint-enable no-undef */
}

/**
 * Converts a style object into CSS kebab-cased style rules.
 *
 * @param styles    Object  Style object to convert
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
 * @param transitionDelay   string    Time delay before transitioning
 * @param fadeIn            boolean   Should we transition?
 * @return {string}
 */
export const setTransitionStyles = (transitionDelay = `0.25s`, fadeIn = true) =>
  fadeIn
    ? `transition: opacity 0.5s ease ${transitionDelay};`
    : `transition: none;`

/**
 * Prevent possible stacking order mismatch with opacity "hack".
 *
 * @param props     Object    Given props by component
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
 * @param backgroundStyles  object    Special background styles to be spread
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
