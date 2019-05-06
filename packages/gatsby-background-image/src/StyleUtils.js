import { isString, stringToArray, toKebabCase } from './HelperUtils'
import { getStyle } from './BackgroundUtils'

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
 * @param className   string    Given className(s) e.g. from styled-components.
 * @param classId     string    (deprecated) Additional classId given.
 * @return {string}
 */
export const fixClassName = (className = ``, classId = ``) => {
  if (typeof window !== `undefined`) {
    // First add a possible classId (until deprecation).
    const currentClassId =
      `${classId && ` gatsby-background-image-${classId}`}` || ``
    // Now check classNames for existing element.
    const classNames = stringToArray(`${className}${currentClassId}`.trim())
    const elementExists = classNames.reduce(
      (exists, currentClass) =>
        exists || document.getElementsByClassName(currentClass).length > 0,
      false
    )
    // TODO: generate fixed randomized class!
    // Should an element exist, add randomized class.
    const additionalClass = elementExists
      ? ` gbi-${Math.random()
          .toString(36)
          .replace(/[^a-z]+/g, '')
          .substr(0, 7)}`
      : ``
    return `${className || ``}${additionalClass || ``}`.trim()
  }
  return className
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
export const vendorPrefixBackgroundStyles = (
  // backgroundSize = `cover`,
  transitionDelay = `0.25s`,
  fadeIn = true
) => {
  // TODO: Look into vendor-prefixes through autoprefix in Gatsby!
  // const vendorPrefixes = ['-webkit-', '-moz-', '-o-', '-ms-', '']
  // let prefixed = ``
  // if (fadeIn) {
  //   prefixed +=
  //     vendorPrefixes
  //       .join(`transition-delay: ${transitionDelay};\n`)
  //       .concat(`transition-delay: ${transitionDelay};\n`) +
  //     vendorPrefixes
  //       .join(`transition: opacity 0.5s;\n`)
  //       .concat(`transition: opacity 0.5s;\n`)
  // } else {
  //   prefixed += vendorPrefixes
  //     .join(`transition: none;\n`)
  //     .concat(`transition: none;\n`)
  // }

  const prefixed = fadeIn
    ? `transition-delay: ${transitionDelay};
            transition: opacity 0.5s;`
    : `transition: none;`
  return prefixed
}

/**
 * Prevent possible stacking order mismatch with opacity "hack".
 *
 * @param props
 * @return {Object}
 */
export const fixOpacity = props => {
  const styledProps = { ...props }

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
            ${vendorPrefixBackgroundStyles(transitionDelay, fadeIn)}
            ${kebabifyBackgroundStyles({ ...backgroundStyles, ...style })}
          }
          ${pseudoBefore} {
            z-index: -100;
            ${
              afterOpacity && nextImage
                ? `background-image: url(${nextImage});`
                : ``
            }
            ${
              !afterOpacity && lastImage
                ? `background-image: url(${lastImage});`
                : ``
            }
            opacity: ${afterOpacity}; 
          }
          ${pseudoAfter} {
            z-index: -101;
            ${
              !afterOpacity && nextImage
                ? `background-image: url(${nextImage});`
                : ``
            }
            ${
              afterOpacity && lastImage
                ? `background-image: url(${lastImage});`
                : ``
            }
          }
        `
}
