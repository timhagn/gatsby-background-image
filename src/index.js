import React from 'react'
import PropTypes from 'prop-types'
import getBackgroundStyles from './BackgroundUtils'

// Handle legacy names for image queries.
const convertProps = props => {
  let convertedProps = { ...props }
  if (convertedProps.resolutions) {
    convertedProps.fixed = convertedProps.resolutions
    delete convertedProps.resolutions
  }
  if (convertedProps.sizes) {
    convertedProps.fluid = convertedProps.sizes
    delete convertedProps.sizes
  }

  return convertedProps
}

// Create lazy image loader with Image().
// Only get's exported for tests!
export const _createImageToLoad = props => {
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

// Cache if we've seen an image before so we don't both with
// lazy-loading & fading in on subsequent mounts.
const imageCache = {}
const inImageCache = props => {
  const convertedProps = convertProps(props)
  // Find src
  const src = convertedProps.fluid
    ? convertedProps.fluid.src
    : convertedProps.fixed.src

  return imageCache[src] || false
}

const activateCacheForImage = props => {
  const convertedProps = convertProps(props)
  // Find src
  const src = convertedProps.fluid
    ? convertedProps.fluid.src
    : convertedProps.fixed.src

  imageCache[src] = true
}

let io
const listeners = []

function getIO() {
  if (
    typeof io === `undefined` &&
    typeof window !== `undefined` &&
    window.IntersectionObserver
  ) {
    io = new window.IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          listeners.forEach(l => {
            if (l[0] === entry.target) {
              // Edge doesn't currently support isIntersecting, so also test for an intersectionRatio > 0
              if (entry.isIntersecting || entry.intersectionRatio > 0) {
                io.unobserve(l[0])
                l[1]()
              }
            }
          })
        })
      },
      { rootMargin: `200px` }
    )
  }

  return io
}

const listenToIntersections = (el, cb) => {
  getIO().observe(el)
  listeners.push([el, cb])
}

const noscriptImg = props => {
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

const createPseudoStyles = ({
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

class BackgroundImage extends React.Component {
  constructor(props) {
    super(props)

    // default settings for browser without Intersection Observer available
    let isVisible = true
    let imgLoaded = false
    let IOSupported = false
    let fadeIn = props.fadeIn

    // If this image has already been loaded before then we can assume it's
    // already in the browser cache so it's cheap to just show directly.
    const seenBefore = inImageCache(props)

    // browser with Intersection Observer available
    if (
      !seenBefore &&
      typeof window !== `undefined` &&
      window.IntersectionObserver
    ) {
      isVisible = false
      IOSupported = true
    }

    // Never render image during SSR
    if (typeof window === `undefined`) {
      isVisible = false
    }

    // Force render for critical images
    if (props.critical) {
      isVisible = true
      IOSupported = false
    }

    const hasNoScript = !(this.props.critical && !this.props.fadeIn)

    this.state = {
      isVisible,
      imgLoaded,
      IOSupported,
      fadeIn,
      hasNoScript,
      seenBefore,
    }

    this.bgImage = ``

    // Get background(-*) styles from CSS (e.g. Styled Components).
    this.backgroundStyles = getBackgroundStyles(this.props.className)

    // "Fake" a reference to an Image loaded in background.
    this.imageRef = _createImageToLoad(this.props)

    this.handleImageLoaded = this.handleImageLoaded.bind(this)
    this.handleRef = this.handleRef.bind(this)
  }

  componentDidMount() {
    if (this.state.isVisible && typeof this.props.onStartLoad === `function`) {
      this.props.onStartLoad({ wasCached: inImageCache(this.props) })
    }
    if (this.props.critical) {
      const img = this.imageRef
      if (img && img.complete) {
        this.handleImageLoaded()
      }
    }
  }

  handleRef(ref) {
    if (this.state.IOSupported && ref) {
      listenToIntersections(ref, () => {
        const imageInCache = inImageCache(this.props)
        if (
          !this.state.isVisible &&
          typeof this.props.onStartLoad === `function`
        ) {
          this.props.onStartLoad({ wasCached: imageInCache })
        }

        this.setState({ isVisible: true, imgLoaded: imageInCache })
      })
    }
  }

  handleImageLoaded() {
    activateCacheForImage(this.props)

    this.setState({ imgLoaded: true })
    if (this.state.seenBefore) {
      this.setState({ fadeIn: false })
    }

    if (this.props.onLoad) {
      this.props.onLoad()
    }
  }

  render() {
    const {
      title,
      alt,
      className,
      style = {},
      fluid,
      fixed,
      backgroundColor,
      Tag,
      classId = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 7),
      children
    } = convertProps(this.props)

    const bgColor =
      typeof backgroundColor === `boolean` ? `lightgray` : backgroundColor

    const backgroundSize =
        this.backgroundStyles.hasOwnProperty(`backgroundSize`) ?
            this.backgroundStyles.backgroundSize :
            `cover`

    const backgroundRepeat = `background-repeat: ${
        this.backgroundStyles.hasOwnProperty(`backgroundRepeat`) ?
            this.backgroundStyles.backgroundRepeat :
            `no-repeat`
        };`

    const transitionDelay = this.state.imgLoaded ? `0.5s` : `0.25s`

    if (fluid) {
      const image = fluid

      // Set the backgroundImage according to images available.
      let bgImage = this.bgImage,
          nextImage = null
      if (image.tracedSVG) nextImage = `"${ image.tracedSVG }"`
      if (image.base64 && !image.tracedSVG) nextImage = image.base64
      if (this.state.isVisible) nextImage = image.src

      // Switch bgImage & nextImage and opacity accordingly.
      bgImage = bgImage === `` ? nextImage : this.bgImage
      const afterOpacity =
          nextImage !== bgImage || this.state.fadeIn === false ? 1 : 0
      this.bgImage = bgImage

      const pseudoStyles = {
        classId,
        backgroundSize,
        backgroundRepeat,
        transitionDelay,
        bgImage,
        nextImage,
        afterOpacity,
        bgColor,
      }

      return (
          <Tag
              className={`${className ? className : ``} gatsby-background-image-${classId} gatsby-image-wrapper`}
              style={{
                position: `relative`,
                overflow: `hidden`,
                ...style,
                ...this.backgroundStyles,
              }}
              ref={this.handleRef}
              key={`fluid-${JSON.stringify(image.srcSet)}`}
          >
            <style dangerouslySetInnerHTML={{
              __html: createPseudoStyles(pseudoStyles)
            }}>
            </style>
            {/* Show the original image during server-side rendering if JavaScript is disabled */}
            {this.state.hasNoScript && (
                <noscript
                    dangerouslySetInnerHTML={{
                      __html: noscriptImg({ alt, title, ...image }),
                    }}
                />
            )}
            {children}
          </Tag>
      )
    }

    if (fixed) {
      const image = fixed
      const divStyle = {
        position: `relative`,
        overflow: `hidden`,
        display: `inline-block`,
        width: image.width,
        height: image.height,
        ...style,
      }

      if (style.display === `inherit`) {
        delete divStyle.display
      }

      // Set the backgroundImage according to images available.
      let bgImage = this.bgImage,
          nextImage = ``
      if (image.tracedSVG) nextImage = `'${ image.tracedSVG }'`
      if (image.base64 && !image.tracedSVG) nextImage = image.base64
      if (this.state.isVisible) nextImage = image.src

      // Switch bgImage & nextImage and opacity accordingly.
      bgImage = bgImage === `` ? nextImage : ``
      const afterOpacity = nextImage !== bgImage ? 1 : 0
      this.bgImage = bgImage

      const pseudoStyles = {
        classId,
        backgroundSize,
        backgroundRepeat,
        transitionDelay,
        bgImage,
        nextImage,
        afterOpacity,
      }

      return (
          <Tag
              className={`${className ? className : ``} gatsby-background-image-${classId} gatsby-image-wrapper`}
              style={{
                ...divStyle,
                ...this.backgroundStyles,
              }}
              ref={this.handleRef}
              key={`fixed-${JSON.stringify(image.srcSet)}`}
          >
            <style dangerouslySetInnerHTML={{
              __html: createPseudoStyles(pseudoStyles)
            }}>
            </style>
            {/* Show the original image during server-side rendering if JavaScript is disabled */}
            {this.state.hasNoScript && (
                <noscript
                    dangerouslySetInnerHTML={{
                      __html: noscriptImg({
                        alt,
                        title,
                        width: image.width,
                        height: image.height,
                        ...image,
                      }),
                    }}
                />
            )}
            {children}
          </Tag>
      )
    }

    return null
  }
}

BackgroundImage.defaultProps = {
  critical: false,
  fadeIn: true,
  alt: ``,
  Tag: `div`,
}

const fixedObject = PropTypes.shape({
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  src: PropTypes.string.isRequired,
  srcSet: PropTypes.string.isRequired,
  base64: PropTypes.string,
  tracedSVG: PropTypes.string,
  srcWebp: PropTypes.string,
  srcSetWebp: PropTypes.string,
})

const fluidObject = PropTypes.shape({
  aspectRatio: PropTypes.number.isRequired,
  src: PropTypes.string.isRequired,
  srcSet: PropTypes.string.isRequired,
  sizes: PropTypes.string.isRequired,
  base64: PropTypes.string,
  tracedSVG: PropTypes.string,
  srcWebp: PropTypes.string,
  srcSetWebp: PropTypes.string,
})

BackgroundImage.propTypes = {
  resolutions: fixedObject,
  sizes: fluidObject,
  fixed: fixedObject,
  fluid: fluidObject,
  fadeIn: PropTypes.bool,
  title: PropTypes.string,
  alt: PropTypes.string,
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]), // Support Glamor's css prop.
  critical: PropTypes.bool,
  style: PropTypes.object,
  imgStyle: PropTypes.object,
  placeholderStyle: PropTypes.object,
  placeholderClassName: PropTypes.string,
  backgroundColor: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  onLoad: PropTypes.func,
  onError: PropTypes.func,
  onStartLoad: PropTypes.func,
  Tag: PropTypes.string,
  classId: PropTypes.string,
}

export default BackgroundImage
