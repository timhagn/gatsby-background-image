import React from 'react'
import PropTypes from 'prop-types'
import getBackgroundStyles from './BackgroundUtils'
import {
  convertProps,
  stripRemainingProps,
} from './HelperUtils'
import {
  activateCacheForImage,
  activatePictureRef,
  createPictureRef,
  getCurrentFromData,
  imagePropsChanged,
  imageReferenceCompleted,
  inImageCache,
  initialBgImage,
  noscriptImg,
  switchImageSettings,
} from './ImageUtils'
import {
  createPseudoStyles,
  fixClassName,
  fixOpacity,
  presetBackgroundStyles,
} from './StyleUtils'
import { listenToIntersections } from './IntersectionObserverUtils'

/**
 * Main Lazy-loading React background-image component
 * with optional support for the blur-up effect.
 */
class BackgroundImage extends React.Component {
  // IntersectionObserver listeners (if available).
  cleanUpListeners

  constructor(props) {
    super(props)

    // Default settings for browser without Intersection Observer available.
    let isVisible = true
    const imgLoaded = false
    let IOSupported = false
    const { fadeIn } = props

    // If this image has already been loaded before then we can assume it's
    // already in the browser cache so it's cheap to just show directly.
    const seenBefore = inImageCache(props)

    // Browser with Intersection Observer available
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

    // Force render for critical images.
    if (props.critical) {
      isVisible = true
      IOSupported = false
    }

    // Check if a noscript element should be included.
    const hasNoScript = !(props.critical && !fadeIn)

    // Set initial image state for transitioning.
    const imageState = 0

    // Fixed class Name (needed for multiple instances).
    const currentClassNames = fixClassName(props)

    this.state = {
      isVisible,
      imgLoaded,
      IOSupported,
      fadeIn,
      hasNoScript,
      seenBefore,
      imageState,
      currentClassNames,
    }

    // Preset backgroundStyles (e.g. during SSR or gatsby build).
    this.backgroundStyles = presetBackgroundStyles(
      getBackgroundStyles(props.className)
    )

    // Bind handlers to class.
    this.handleImageLoaded = this.handleImageLoaded.bind(this)
    this.handleRef = this.handleRef.bind(this)

    // Create reference(s) to an Image loaded via picture element in background.
    this.imageRef = createPictureRef(
      { ...props, isVisible },
      this.handleImageLoaded
    )
    // Start with base64, tracedSVG or empty background image(s).
    this.bgImage = initialBgImage(props)

    // console.log(`-------------------------------------------------------------`)
  }

  componentDidMount() {
    // Update background(-*) styles from CSS (e.g. Styled Components).
    this.backgroundStyles = presetBackgroundStyles(
      getBackgroundStyles(this.props.className)
    )

    if (this.state.isVisible && typeof this.props.onStartLoad === `function`) {
      this.props.onStartLoad({ wasCached: inImageCache(this.props) })
    }

    if (this.props.critical) {
      if (imageReferenceCompleted(this.imageRef)) {
        this.handleImageLoaded()
      }
    }
  }

  componentDidUpdate(prevProps) {
    // Check if we received a changed fluid / fixed image.
    if (imagePropsChanged(this.props, prevProps)) {
      const imageInCache = inImageCache(this.props)

      this.setState(
        {
          isVisible: imageInCache || this.props.critical,
          imgLoaded: imageInCache,
          // currentClassNames:
          //   this.state.currentClassNames ||
          //   fixClassName(this.props.className, this.randomClass),
          // imageState: (this.state.imageState + 1) % 2,
        },
        () => {
          // Update bgImage & create new imageRef(s).
          this.bgImage =
            getCurrentFromData({
              data: this.imageRef,
              propName: `currentSrc`,
              returnArray: true,
            }) ||
            getCurrentFromData({
              data: this.imageRef,
              propName: `src`,
              returnArray: true,
            })
          this.imageRef = createPictureRef(
            { ...this.props, isVisible: this.state.isVisible },
            this.handleImageLoaded
          )
        }
      )
    }
  }

  componentWillUnmount() {
    // Prevent calling handleImageLoaded from the imageRef(s) after unmount.
    if (this.imageRef) {
      if (Array.isArray(this.imageRef)) {
        this.imageRef.forEach(
          currentImageRef => (currentImageRef.onload = null)
        )
      } else {
        this.imageRef.onload = null
      }
    }
    // Clean up all IntersectionObserver listeners.
    if (this.cleanUpListeners) {
      this.cleanUpListeners()
    }
  }

  intersectionListener = () => {
    const imageInCache = inImageCache(this.props)
    if (!this.state.isVisible && typeof this.props.onStartLoad === `function`) {
      this.props.onStartLoad({ wasCached: imageInCache })
    }

    // imgCached and imgLoaded must update after the image is activated and
    // isVisible is true. Once it is, imageRef becomes "accessible" for imgCached.
    // imgLoaded and imgCached are in a 2nd setState call to be changed together,
    // avoiding initiating unnecessary animation frames from style changes when
    // setting next imageState.
    this.imageRef = activatePictureRef(this.imageRef, this.props)
    this.setState(
      {
        isVisible: true,
        imageState: this.state.imageState + 1,
      },
      () => {
        this.setState({
          imgLoaded: imageInCache,
          imgCached: !!this.imageRef.currentSrc,
          imageState: this.state.imageState + 1,
        })
      }
    )
  }

  handleRef(ref) {
    if (this.state.IOSupported && ref) {
      this.cleanUpListeners = listenToIntersections(
        ref,
        this.intersectionListener
      )
    }
  }

  handleImageLoaded() {
    activateCacheForImage(this.props)

    this.setState({
      imgLoaded: true,
      imageState: this.state.imageState + 1,
    })
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
      durationFadeIn,
      Tag,
      children,
      classId = !className
        ? `${Math.random()
            .toString(36)
            .replace(/[^a-z]+/g, '')
            .substr(0, 7)}_depr`
        : ``,
      ...props
    } = fixOpacity(convertProps(this.props))

    const remainingProps = stripRemainingProps(props)

    const bgColor =
      typeof backgroundColor === `boolean`
        ? `lightgray`
        : typeof backgroundColor !== `undefined`
        ? backgroundColor
        : ``

    const shouldFadeIn =
      (this.state.fadeIn === true && !this.state.imgCached) ||
      this.props.fadeIn === `soft`
    const transitionDelay = this.state.imgLoaded
      ? `${durationFadeIn}ms`
      : `0.25s`

    const divStyle = {
      position: `relative`,
      overflow: `hidden`,
      opacity: 0.99,
      ...style,
    }

    // Choose image object of fluid or fixed, return null if not present.
    let image, noScriptImageData
    if (fluid) {
      image = fluid
      noScriptImageData = Array.isArray(fluid) ? fluid[0] : fluid
    } else if (fixed) {
      image = fixed
      divStyle.width = image.width
      divStyle.height = image.height
      divStyle.display = `inline-block`

      if (style.display === `inherit`) {
        delete divStyle.display
      }
      noScriptImageData = Array.isArray(fixed) ? fixed[0] : fixed
    } else {
      return null
    }

    // Set background-images and visibility according to images available.
    const newImageSettings = switchImageSettings({
      image,
      bgImage: this.bgImage,
      imageRef: this.imageRef,
      state: this.state,
    })

    // Set bgImage (the next lastImage) to available newImageSettings or fallback.
    this.bgImage =
      newImageSettings.nextImageArray ||
      newImageSettings.nextImage ||
      this.bgImage

    const pseudoStyles = createPseudoStyles({
      classId,
      className: this.state.currentClassNames,
      transitionDelay,
      bgColor,
      backgroundStyles: this.backgroundStyles,
      style,
      fadeIn: shouldFadeIn,
      ...newImageSettings,
    })

    // console.table(newImageSettings)
    // console.log(pseudoStyles)

    // Switch key between fluid & fixed.
    const componentKey = `${fluid && `fluid`}${fixed &&
      `fixed`}-${JSON.stringify(noScriptImageData.srcSet)}`

    return (
      <Tag
        className={`${this.state.currentClassNames || ``}${classId &&
          ` gatsby-background-image-${classId}`} gatsby-image-wrapper`}
        style={{
          ...divStyle,
          ...this.backgroundStyles,
        }}
        title={title}
        ref={this.handleRef}
        key={componentKey}
        {...remainingProps}
      >
        {/* Create style element to transition between pseudo-elements. */}
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
                ...(divStyle.width && divStyle.width),
                ...(divStyle.height && divStyle.height),
                ...noScriptImageData,
              }),
            }}
          />
        )}
        {children}
      </Tag>
    )
  }
}

BackgroundImage.defaultProps = {
  critical: false,
  fadeIn: true,
  durationFadeIn: 500,
  alt: ``,
  title: ``,
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
  resolutions: PropTypes.oneOfType([
    fixedObject,
    PropTypes.arrayOf(fixedObject),
  ]),
  sizes: PropTypes.oneOfType([fluidObject, PropTypes.arrayOf(fluidObject)]),
  fixed: PropTypes.oneOfType([fixedObject, PropTypes.arrayOf(fixedObject)]),
  fluid: PropTypes.oneOfType([fluidObject, PropTypes.arrayOf(fluidObject)]),
  fadeIn: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  durationFadeIn: PropTypes.number,
  title: PropTypes.string,
  alt: PropTypes.string,
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]), // Support Glamor's css prop.
  critical: PropTypes.bool,
  crossOrigin: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]), // Using PropTypes from RN.
  backgroundColor: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  onLoad: PropTypes.func,
  onError: PropTypes.func,
  onStartLoad: PropTypes.func,
  Tag: PropTypes.string,
  classId: PropTypes.string,
}

export default BackgroundImage
