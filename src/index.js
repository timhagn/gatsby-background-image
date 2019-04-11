import React from 'react'
import PropTypes from 'prop-types'
import getBackgroundStyles from './BackgroundUtils'
import { convertProps } from './HelperUtils'
import {
  activateCacheForImage,
  createPictureRef,
  inImageCache,
  noscriptImg,
  switchImageSettings,
} from './ImageUtils'
import {
  createPseudoStyles,
  fixOpacity,
  presetBackgroundStyles,
} from './StyleUtils'
import { listenToIntersections } from './IntersectionObserverUtils'

class BackgroundImage extends React.Component {
  _isMounted = false

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
    this.backgroundStyles = presetBackgroundStyles(
      getBackgroundStyles(this.props.className)
    )
    // Testing how to grab pseudo-Elements' styles & media-queries
    // this.backgroundPseudoStyles =
    //   getBackgroundStyles(
    //     this.props.className.split(' ').map(name => `.${name}::after, .${name}::before`).join(' ')
    //   )
    // this.backgroundBeforeStyles =       getBackgroundStyles(
    //   this.props.className.split(' ').map(name => `${name}::before`).join(' ')
    // )

    this.handleImageLoaded = this.handleImageLoaded.bind(this)
    this.handleRef = this.handleRef.bind(this)

    // "Fake" a reference to an Image loaded via picture element in background.
    this.imageRef = createPictureRef(this.props, this.handleImageLoaded)
  }

  componentDidMount() {
    this._isMounted = true

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

  componentWillUnmount() {
    this._isMounted = false
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
    if (this._isMounted) {
      activateCacheForImage(this.props)

      this.setState({ imgLoaded: true })
      if (this.state.seenBefore) {
        // console.log(`seen`)
        this.setState({ fadeIn: false })
      }

      if (this.props.onLoad) {
        this.props.onLoad()
      }
    }
  }

  render() {
    const {
      title,
      id,
      alt,
      className,
      style = {},
      fluid,
      fixed,
      backgroundColor,
      Tag,
      children,
      classId = !className
        ? Math.random()
            .toString(36)
            .replace(/[^a-z]+/g, '')
            .substr(0, 7)
        : ``,
    } = fixOpacity(convertProps(this.props))

    const bgColor =
      typeof backgroundColor === `boolean`
        ? `lightgray`
        : typeof backgroundColor !== `undefined`
        ? backgroundColor
        : ``

    const transitionDelay = this.state.imgLoaded ? `0.5s` : `0.25s`

    if (fluid) {
      const image = fluid

      // Set the backgroundImage according to images available.
      const newImageSettings = switchImageSettings({
        image,
        bgImage: this.bgImage,
        imageRef: this.imageRef,
        isVisible: this.state.isVisible,
      })
      this.bgImage = newImageSettings.bgImage
        ? newImageSettings.bgImage
        : newImageSettings.lastImage

      const pseudoStyles = createPseudoStyles({
        classId,
        className,
        transitionDelay,
        bgColor,
        backgroundStyles: this.backgroundStyles,
        fadeIn: this.state.fadeIn,
        ...newImageSettings,
      })

      // console.log(pseudoStyles)
      // console.log(backgroundColor, bgColor, `${bgColor && `background-color: ${bgColor};`}`)

      return (
        <Tag
          className={`${className ? className : ``}${classId &&
            `gatsby-background-image-${classId}`} gatsby-image-wrapper`}
          style={{
            position: `relative`,
            overflow: `hidden`,
            opacity: 0.99,
            ...style,
            ...this.backgroundStyles,
          }}
          id={id}
          ref={this.handleRef}
          key={`fluid-${JSON.stringify(image.srcSet)}`}
        >
          <style
            dangerouslySetInnerHTML={{
              __html: pseudoStyles,
            }}
          />
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
        opacity: 0.99,
        ...style,
      }

      if (style.display === `inherit`) {
        delete divStyle.display
      }

      // Set the backgroundImage according to images available.
      const newImageSettings = switchImageSettings({
        image,
        bgImage: this.bgImage,
        imageRef: this.imageRef,
        isVisible: this.state.isVisible,
      })
      this.bgImage = newImageSettings.bgImage
        ? newImageSettings.bgImage
        : newImageSettings.lastImage

      const pseudoStyles = createPseudoStyles({
        classId,
        className,
        transitionDelay,
        bgColor,
        backgroundStyles: this.backgroundStyles,
        fadeIn: this.state.fadeIn,
        ...newImageSettings,
      })

      return (
        <Tag
          className={`${className ? className : ``}${
            classId ? ` gatsby-background-image-${classId}` : ``
          } gatsby-image-wrapper`}
          style={{
            ...divStyle,
            ...this.backgroundStyles,
          }}
          id={id}
          ref={this.handleRef}
          key={`fixed-${JSON.stringify(image.srcSet)}`}
        >
          <style
            dangerouslySetInnerHTML={{
              __html: pseudoStyles,
            }}
          />
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
  id: ``,
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
  id: PropTypes.string,
  alt: PropTypes.string,
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]), // Support Glamor's css prop.
  critical: PropTypes.bool,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]), // Just took the one from RN.
  backgroundColor: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  onLoad: PropTypes.func,
  onError: PropTypes.func,
  onStartLoad: PropTypes.func,
  Tag: PropTypes.string,
  classId: PropTypes.string,
}

export default BackgroundImage
