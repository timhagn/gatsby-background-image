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
      if (isNaN(styledProps.style.opacity) || styledProps.style.opacity > .99) {
        styledProps.style.opacity = .99
      }
    }
  } catch (e) {}

  return styledProps
}


/**
 * Creates styles for the changing pseudo-elements' backgrounds.
 *
 * @param classId
 * @param backgroundSize
 * @param backgroundPosition
 * @param backgroundRepeat
 * @param transitionDelay
 * @param bgImage
 * @param nextImage
 * @param afterOpacity
 * @param bgColor
 * @param noBase64
 * @return {string}
 */
export const createPseudoStyles = ({
                              classId,
                              backgroundSize,
                              backgroundPosition,
                              backgroundRepeat,
                              transitionDelay,
                              bgImage,
                              lastImage,
                              nextImage,
                              afterOpacity,
                              bgColor,
                              fadeIn,
                            }) => {
  return `
          .gatsby-background-image-${classId}:before,
          .gatsby-background-image-${classId}:after {
            content: '';
            display: block;
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            background-position: ${backgroundPosition};
            ${vendorPrefixBackgroundStyles(backgroundSize, transitionDelay, fadeIn)}
          }
          .gatsby-background-image-${classId}:before {
            z-index: -100;
            ${!afterOpacity && lastImage !== `` 
                ? `background-image: url(${lastImage});` 
                : ``}
            ${afterOpacity && (nextImage || bgImage) 
                ? `background-image: url(${nextImage || bgImage});` 
                : ``}
            ${backgroundRepeat}
            ${bgColor && `background-color: ${bgColor};`}
            opacity: ${afterOpacity}; 
          }
          .gatsby-background-image-${classId}:after {
            z-index: -101;
            ${bgColor && `background-color: ${bgColor};`}
            ${afterOpacity && lastImage !== `` 
                ? `background-image: url(${lastImage});` 
                : ``}
            ${!afterOpacity && (bgImage || nextImage) 
                ? `background-image: url(${bgImage || nextImage});`
                : ``}
            ${backgroundRepeat}
          }
        `
}

/**
 * Creates vendor prefixed background styles.
 *
 * @param backgroundSize
 * @param transitionDelay
 * @param fadeIn
 * @return {string}
 */
export const vendorPrefixBackgroundStyles = (backgroundSize = `cover`,
                                             transitionDelay = `0.25s`,
                                             fadeIn = true) => {
  const vendorPrefixes = [
    '-webkit-',
    '-moz-',
    '-o-',
    '-ms-',
    ''
  ]
  let prefixed = vendorPrefixes.join(`background-size: ${backgroundSize};\n`)
         .concat(`background-size: ${backgroundSize};\n`)
  if (fadeIn) {
    prefixed += vendorPrefixes.join(`transition-delay: ${transitionDelay};\n`)
        .concat(`transition-delay: ${transitionDelay};\n`) +
    vendorPrefixes.join(`transition: opacity 0.5s;\n`)
        .concat(`transition: opacity 0.5s;\n`)
  }
  else {
    prefixed += vendorPrefixes.join(`transition: none;\n`)
        .concat(`transition: none;\n`)
  }
  return prefixed
}