import React from 'react'
import PropTypes from 'prop-types'
import getBackgroundStyles from './BackgroundUtils'
import { convertProps, stripRemainingProps } from './HelperUtils'
import {
  activateCacheForImage,
  createPictureRef,
  imagePropsChanged,
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

/**
 * Main Lazy-loading React background-image component
 * with optional support for the blur-up effect.
 */
class BackgroundImage extends React.Component {
  // Needed to prevent handleImageLoaded() firing on gatsby build.
  isMounted = false
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

    this.state = {
      isVisible,
      imgLoaded,
      IOSupported,
      fadeIn,
      hasNoScript,
      seenBefore,
      imageState,
    }

    // Preset backgroundStyles (e.g. during SSR or gatsby build).
    this.backgroundStyles = presetBackgroundStyles(
      getBackgroundStyles(this.props.className)
    )

    // Start with an empty background image.
    this.bgImage = ``

    this.handleImageLoaded = this.handleImageLoaded.bind(this)
    this.handleRef = this.handleRef.bind(this)

    // "Fake" a reference to an Image loaded via picture element in background.
    this.imageRef = createPictureRef(this.props, this.handleImageLoaded)

    // console.log(`-------------------------------------------------------------`)
  }

  componentDidMount() {
    this.isMounted = true

    // Update background(-*) styles from CSS (e.g. Styled Components).
    this.backgroundStyles = presetBackgroundStyles(
      getBackgroundStyles(this.props.className)
    )

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

  componentDidUpdate(prevProps) {
    // Check if we received a changed fluid / fixed image.
    if (imagePropsChanged(this.props, prevProps)) {
      const imageInCache = inImageCache(this.props)
      this.setState(
        {
          isVisible: imageInCache || this.props.critical,
          imgLoaded: imageInCache,
          // imageState: (this.state.imageState + 1) % 2,
        },
        () => {
          // Update bgImage & create new imageRef.
          this.bgImage =
            (this.imageRef && this.imageRef.currentSrc) ||
            // (this.imageRef && this.imageRef.src) ||
            ``
          this.imageRef = createPictureRef(this.props, this.handleImageLoaded)
        }
      )
    }
  }

  componentWillUnmount() {
    this.isMounted = false
    if (this.cleanUpListeners) {
      this.cleanUpListeners()
    }
  }

  intersectionListener = () => {
    const imageInCache = inImageCache(this.props)
    if (!this.state.isVisible && typeof this.props.onStartLoad === `function`) {
      this.props.onStartLoad({ wasCached: imageInCache })
    }

    // imgCached and imgLoaded must update after isVisible,
    // Once isVisible is true, imageRef becomes "accessible",
    // which imgCached needs access to.
    // imgLoaded and imgCached are in a 2nd setState call to be changed together,
    // avoiding initiating unnecessary animation frames from style changes.
    this.setState({ isVisible: true }, () =>
      this.setState({
        imgLoaded: imageInCache,
        imgCached: !!this.imageRef.currentSrc,
        imageState: this.state.imageState + 1,
      })
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
    if (this.isMounted) {
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
    let image
    if (fluid) {
      image = fluid
    } else if (fixed) {
      image = fixed
      divStyle.width = image.width
      divStyle.height = image.height
      divStyle.display = `inline-block`

      if (style.display === `inherit`) {
        delete divStyle.display
      }
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
    // this.bgImage = newImageSettings.bgImage
    //   ? newImageSettings.bgImage
    //   : newImageSettings.lastImage
    this.bgImage = newImageSettings.nextImage || this.bgImage

    const pseudoStyles = createPseudoStyles({
      classId,
      className,
      transitionDelay,
      bgColor,
      backgroundStyles: this.backgroundStyles,
      style,
      fadeIn: shouldFadeIn,
      ...newImageSettings,
    })

    // className.indexOf(`StyledHeader`) !== -1 && console.log(newImageSettings)

    // Switch key between fluid & fixed.
    const componentKey = `${fluid && `fluid`}${fixed &&
      `fixed`}-${JSON.stringify(image.srcSet)}`

    return (
      <Tag
        className={`${className || ``}${classId &&
          `gatsby-background-image-${classId}`} gatsby-image-wrapper`}
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
                ...image,
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
  resolutions: fixedObject,
  sizes: fluidObject,
  fixed: fixedObject,
  fluid: fluidObject,
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
