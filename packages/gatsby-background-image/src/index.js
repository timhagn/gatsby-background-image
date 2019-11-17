import React from 'react'
import PropTypes from 'prop-types'
import getBackgroundStyles from './lib/BackgroundUtils'
import { convertProps, stripRemainingProps } from './lib/HelperUtils'
import {
  getCurrentFromData,
  imagePropsChanged,
  imageReferenceCompleted,
} from './lib/ImageUtils'
import {
  createNoScriptStyles,
  createPseudoStyles,
  fixClassName,
  fixOpacity,
  presetBackgroundStyles,
} from './lib/StyleUtils'
import { listenToIntersections } from './lib/IntersectionObserverUtils'
import { activateCacheForImage, inImageCache } from './lib/ImageCache'
import { activatePictureRef, createPictureRef } from './lib/ImageRef'
import { initialBgImage, switchImageSettings } from './lib/ImageHandling'

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

    // Fixed class Name & added one (needed for multiple instances).
    const [currentClassNames] = fixClassName(props)

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

    this.selfRef = null

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

    const [currentClassNames] = fixClassName(this.props)
    this.setState({ currentClassNames })
  }

  componentDidUpdate(prevProps) {
    // Check if we received a changed fluid / fixed image.
    if (imagePropsChanged(this.props, prevProps)) {
      const imageInCache = inImageCache(this.props)
      const [currentClassNames] = fixClassName(this.props)

      this.setState(
        {
          isVisible: imageInCache || this.props.critical,
          imgLoaded: imageInCache,
          currentClassNames,

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
    this.imageRef = activatePictureRef(this.imageRef, this.props, this.selfRef)
    this.setState(
      state => ({
        isVisible: true,
        imageState: state.imageState + 1,
      }),
      () => {
        this.setState(state => ({
          imgLoaded: imageInCache,
          imgCached: !!this.imageRef.currentSrc,
          imageState: state.imageState + 1,
        }))
      }
    )
  }

  handleRef(ref) {
    this.selfRef = ref
    if (this.state.IOSupported && ref) {
      this.cleanUpListeners = listenToIntersections(
        ref,
        this.intersectionListener,
        this.props.rootMargin
      )
    }
  }

  handleImageLoaded() {
    activateCacheForImage(this.props)

    this.setState(state => ({
      imgLoaded: true,
      imageState: state.imageState + 1,
    }))
    if (this.state.seenBefore) {
      this.setState({ fadeIn: false })
    }

    if (this.props.onLoad) {
      this.props.onLoad()
    }
  }

  render() {
    const {
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
    } = fixOpacity(convertProps(this.props), this.props.preserveStackingContext)

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

    // Create base container style and only add opacity hack when
    // preserveStackingContext is falsy.
    const divStyle = {
      position: `relative`,
      ...style,
    }
    if (!this.props.preserveStackingContext) divStyle.opacity = 0.99

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

    // Set bgImage to available newImageSettings or fallback.
    this.bgImage =
      newImageSettings.nextImageArray ||
      newImageSettings.nextImage ||
      this.bgImage

    // Create styles for the next background image(s).
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

    const noScriptPseudoStyles = createNoScriptStyles({
      image,
      bgColor,
      classId,
      className: this.state.currentClassNames,
      backgroundStyles: this.backgroundStyles,
      style,
    })

    // console.table(newImageSettings)
    // console.log(pseudoStyles)
    // console.log(image, noScriptPseudoStyles)

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
        {/* Set the original image(s) during SSR & if JS is disabled */}
        {this.state.hasNoScript && (
          <noscript>
            <style
              dangerouslySetInnerHTML={{
                __html: noScriptPseudoStyles,
              }}
            />
          </noscript>
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
  Tag: `div`,
  preserveStackingContext: false,
  rootMargin: `200px`,
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
  media: PropTypes.string,
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
  media: PropTypes.string,
})

BackgroundImage.propTypes = {
  resolutions: PropTypes.oneOfType([
    fixedObject,
    PropTypes.arrayOf(fixedObject),
    PropTypes.arrayOf(PropTypes.oneOfType([fixedObject, PropTypes.string])),
  ]),
  sizes: PropTypes.oneOfType([
    fluidObject,
    PropTypes.arrayOf(fluidObject),
    PropTypes.arrayOf(PropTypes.oneOfType([fluidObject, PropTypes.string])),
  ]),
  fixed: PropTypes.oneOfType([
    fixedObject,
    PropTypes.arrayOf(fixedObject),
    PropTypes.arrayOf(PropTypes.oneOfType([fixedObject, PropTypes.string])),
  ]),
  fluid: PropTypes.oneOfType([
    fluidObject,
    PropTypes.arrayOf(fluidObject),
    PropTypes.arrayOf(PropTypes.oneOfType([fluidObject, PropTypes.string])),
  ]),
  fadeIn: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  durationFadeIn: PropTypes.number,
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]), // Support Glamor's css prop.
  critical: PropTypes.bool,
  crossOrigin: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]), // Using PropTypes from RN.
  backgroundColor: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  onLoad: PropTypes.func,
  onError: PropTypes.func,
  onStartLoad: PropTypes.func,
  Tag: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  classId: PropTypes.string,
  preserveStackingContext: PropTypes.bool,
  rootMargin: PropTypes.string,
}

export default BackgroundImage
