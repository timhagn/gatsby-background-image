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
                              nextImage,
                              afterOpacity,
                              bgColor,
                              noBase64,
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
            ${vendorPrefixBackgroundStyles(backgroundSize, transitionDelay)}
          }
          .gatsby-background-image-${classId}:before {
            z-index: -100;
            ${nextImage && `background-image: url(${nextImage});`}
            ${backgroundRepeat}
            ${bgColor && `background-color: ${bgColor};`}
            opacity: ${afterOpacity}; 
          }
          .gatsby-background-image-${classId}:after {
            z-index: -101;
            ${bgColor && `background-color: ${bgColor};`}
            ${bgImage && nextImage !== bgImage ? `background-image: url(${bgImage});` : ``}
            ${backgroundRepeat}
          }
        `
}

/**
 * Creates vendor prefixed background styles.
 *
 * @param backgroundSize
 * @param transitionDelay
 * @return {string}
 */
export const vendorPrefixBackgroundStyles = (backgroundSize = `cover`,
                                             transitionDelay = `0.25s`) => {
  const vendorPrefixes = [
    '-webkit-',
    '-moz-',
    '-o-',
    '-ms-',
    ''
  ]
  return vendorPrefixes.join(`background-size: ${backgroundSize};\n`)
         .concat(`background-size: ${backgroundSize};\n`) +
         vendorPrefixes.join(`transition-delay: ${transitionDelay};\n`)
         .concat(`transition-delay: ${transitionDelay};\n`) +
         vendorPrefixes.join(`transition: opacity 0.5s;\n`)
         .concat(`transition: opacity 0.5s;\n`)
}