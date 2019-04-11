import { isString, stringToArray, toKebabCase } from './HelperUtils'
import { getStyle } from './BackgroundUtils'

/**
 * Prevent possible stacking order mismatch with opacity "hack".
 *
 * @param props
 * @return {Object}
 */
export const fixOpacity = props => {
  let styledProps = { ...props }

  try {
    if (styledProps.style && styledProps.style.opacity) {
      if (
        isNaN(styledProps.style.opacity) ||
        styledProps.style.opacity > 0.99
      ) {
        styledProps.style.opacity = 0.99
      }
    }
  } catch (e) {}

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
 * @param classId
 * @param className
 * @param transitionDelay
 * @param bgImage
 * @param lastImage
 * @param nextImage
 * @param afterOpacity
 * @param bgColor
 * @param fadeIn
 * @param backgroundStyles
 * @param style
 * @return {string}
 */
export const createPseudoStyles = ({
  classId,
  className,
  transitionDelay,
  bgImage,
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
            ${vendorPrefixBackgroundStyles(transitionDelay, fadeIn)}
            ${kebabifyBackgroundStyles({ ...backgroundStyles, ...style })}
          }
          ${pseudoBefore} {
            z-index: -100;
            ${
              !afterOpacity && lastImage !== ``
                ? `background-image: url(${lastImage});`
                : ``
            }
            ${
              afterOpacity && (nextImage || bgImage)
                ? `background-image: url(${nextImage || bgImage});`
                : ``
            }
            ${bgColor && `background-color: ${bgColor};`}
            opacity: ${afterOpacity}; 
          }
          ${pseudoAfter} {
            z-index: -101;
            ${
              afterOpacity && lastImage !== ``
                ? `background-image: url(${lastImage});`
                : ``
            }
            ${
              !afterOpacity && (bgImage || nextImage)
                ? `background-image: url(${bgImage || nextImage});`
                : ``
            }
            ${bgColor && `background-color: ${bgColor};`}
          }
        `
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
  if (classes instanceof Array) {
    pseudoClasses = `.${classes
      .filter(currClass => {
        const styles = getStyle(`.${currClass}`)
        return typeof styles !== `undefined`
      })
      .join('.')}${appendix}`
  }
  if (classId !== ``) {
    pseudoClasses += `${pseudoClasses &&
      `,\n`}.gatsby-background-image-${classId}${appendix}`
  }
  return pseudoClasses
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
  /*
  const vendorPrefixes = ['-webkit-', '-moz-', '-o-', '-ms-', '']
  let prefixed = vendorPrefixes
    .join(`background-size: ${backgroundSize};\n`)
    .concat(`background-size: ${backgroundSize};\n`)
  if (fadeIn) {
    prefixed +=
      vendorPrefixes
        .join(`transition-delay: ${transitionDelay};\n`)
        .concat(`transition-delay: ${transitionDelay};\n`) +
      vendorPrefixes
        .join(`transition: opacity 0.5s;\n`)
        .concat(`transition: opacity 0.5s;\n`)
  } else {
    prefixed += vendorPrefixes
      .join(`transition: none;\n`)
      .concat(`transition: none;\n`)
  }
  */
  let prefixed = fadeIn
    ? `transition-delay: ${transitionDelay};
            transition: opacity 0.5s;`
    : `transition: none;`
  return prefixed
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
  } else if (styles instanceof Object) {
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
