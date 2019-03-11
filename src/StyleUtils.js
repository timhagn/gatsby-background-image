/**
 * Prevent possible stacking order mismatch with opacity "hack".
 *
 * @param props
 * @return {Object}
 */
export const fixOpacity = props => {
  let styledProps = { ...props }

  try {
    if (styledProps.style.opacity) {
      if (isNaN(styledProps.style.opacity) || styledProps.style.opacity > .99) {
        styledProps.style.opacity = .99
      }
    }
  } catch (e) {
    console.debug('Error getting opacity from style prop: ', e.message)
  }

  return styledProps
}


/**
 * Creates styles for the changing pseudo-elements' backgrounds.
 *
 * @param classId
 * @param backgroundSize
 * @param backgroundRepeat
 * @param transitionDelay
 * @param bgImage
 * @param nextImage
 * @param afterOpacity
 * @param bgColor
 * @return {string}
 */
export const createPseudoStyles = ({
                              classId,
                              backgroundSize,
                              backgroundRepeat,
                              transitionDelay,
                              bgImage,
                              nextImage,
                              afterOpacity,
                              bgColor,
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
            -webkit-background-size: ${backgroundSize};
            -moz-background-size: ${backgroundSize};
            -o-background-size: ${backgroundSize};
            background-size: ${backgroundSize};
            transition: opacity ${transitionDelay} ease-in-out;
            -webkit-transition: opacity ${transitionDelay} ease-in-out;
            -moz-transition: opacity ${transitionDelay} ease-in-out;
            -o-transition: opacity ${transitionDelay} ease-in-out;
          }
          .gatsby-background-image-${classId}:before {
            z-index: -101;
            background-color: ${bgColor};
            background-image: url(${bgImage});
            ${backgroundRepeat}
          }
          .gatsby-background-image-${classId}:after {
            z-index: -100;
            background-image: url(${nextImage});
            ${backgroundRepeat}
            opacity: ${afterOpacity};
          }
        `
}