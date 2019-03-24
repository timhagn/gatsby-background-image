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
            -webkit-background-size: ${backgroundSize};
            -moz-background-size: ${backgroundSize};
            -o-background-size: ${backgroundSize};
            background-size: ${backgroundSize};
            background-position: ${backgroundPosition};
            -webkit-transition-delay: ${transitionDelay};
            -moz-transition-delay: ${transitionDelay};
            -o-transition-delay: ${transitionDelay};
            transition-delay: ${transitionDelay};
            -webkit-transition: opacity 0.5s;
            -moz-transition: opacity 0.5s;
            -o-transition: opacity 0.5s;
            transition: opacity 0.5s;
          }
          .gatsby-background-image-${classId}:before {
            z-index: -100;
            ${nextImage && nextImage !== bgImage ? `background-image: url(${nextImage});` : ``}
            ${backgroundRepeat}
            ${bgColor && `background-color: ${bgColor};`}
            opacity: ${afterOpacity}; 
          }
          .gatsby-background-image-${classId}:after {
            z-index: -101;
            ${bgColor && `background-color: ${bgColor};`}
            ${bgImage && `background-image: url(${bgImage});`}
            ${backgroundRepeat}
          }
        `
}