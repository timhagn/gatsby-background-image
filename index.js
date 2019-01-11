"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _BackgroundUtils = _interopRequireDefault(require("./BackgroundUtils"));

// Handle legacy names for image queries.
const convertProps = props => {
  let convertedProps = Object.assign({}, props);

  if (convertedProps.resolutions) {
    convertedProps.fixed = convertedProps.resolutions;
    delete convertedProps.resolutions;
  }

  if (convertedProps.sizes) {
    convertedProps.fluid = convertedProps.sizes;
    delete convertedProps.sizes;
  }

  return convertedProps;
}; // Cache if we've seen an image before so we don't both with
// lazy-loading & fading in on subsequent mounts.


const imageCache = {};

const inImageCache = props => {
  const convertedProps = convertProps(props); // Find src

  const src = convertedProps.fluid ? convertedProps.fluid.src : convertedProps.fixed.src;
  return imageCache[src] || false;
};

const activateCacheForImage = props => {
  const convertedProps = convertProps(props); // Find src

  const src = convertedProps.fluid ? convertedProps.fluid.src : convertedProps.fixed.src;
  imageCache[src] = true;
};

let io;
const listeners = [];

function getIO() {
  if (typeof io === `undefined` && typeof window !== `undefined` && window.IntersectionObserver) {
    io = new window.IntersectionObserver(entries => {
      entries.forEach(entry => {
        listeners.forEach(l => {
          if (l[0] === entry.target) {
            // Edge doesn't currently support isIntersecting, so also test for an intersectionRatio > 0
            if (entry.isIntersecting || entry.intersectionRatio > 0) {
              io.unobserve(l[0]);
              l[1]();
            }
          }
        });
      });
    }, {
      rootMargin: `200px`
    });
  }

  return io;
}

const listenToIntersections = (el, cb) => {
  getIO().observe(el);
  listeners.push([el, cb]);
};

const noscriptImg = props => {
  // Check if prop exists before adding each attribute to the string output below to prevent
  // HTML validation issues caused by empty values like width="" and height=""
  const src = props.src ? `src="${props.src}" ` : `src="" `; // required attribute

  const sizes = props.sizes ? `sizes="${props.sizes}" ` : ``;
  const srcSetWebp = props.srcSetWebp ? `<source type='image/webp' srcSet="${props.srcSetWebp}" ${sizes}/>` : ``;
  const srcSet = props.srcSet ? `<source srcSet="${props.srcSet}" ${sizes}/>` : ``;
  const title = props.title ? `title="${props.title}" ` : ``;
  const alt = props.alt ? `alt="${props.alt}" ` : `alt="" `; // required attribute

  const width = props.width ? `width="${props.width}" ` : ``;
  const height = props.height ? `height="${props.height}" ` : ``;
  const opacity = props.opacity ? props.opacity : `1`;
  const transitionDelay = props.transitionDelay ? props.transitionDelay : `0.5s`;
  return `<picture>${srcSetWebp}${srcSet}<img ${width}${height}${src}${alt}${title}style="position:absolute;top:0;left:0;transition:opacity 0.5s;transition-delay:${transitionDelay};opacity:${opacity};width:100%;height:100%;object-fit:cover;object-position:center"/></picture>`;
};

const Img = _react.default.forwardRef((props, ref) => {
  const style = props.style,
        onLoad = props.onLoad,
        onError = props.onError,
        alt = props.alt,
        otherProps = (0, _objectWithoutPropertiesLoose2.default)(props, ["style", "onLoad", "onError", "alt"]);
  return _react.default.createElement("img", (0, _extends2.default)({}, otherProps, {
    alt: alt,
    onLoad: onLoad,
    onError: onError,
    ref: ref,
    style: Object.assign({
      position: `absolute`,
      top: 0,
      left: 0,
      width: `100%`,
      height: `100%`,
      objectFit: `cover`,
      objectPosition: `center`
    }, style)
  }));
});

Img.propTypes = {
  style: _propTypes.default.object,
  onError: _propTypes.default.func,
  onLoad: _propTypes.default.func
};

class BackgroundImage extends _react.default.Component {
  constructor(props) {
    super(props); // default settings for browser without Intersection Observer available

    let isVisible = true;
    let imgLoaded = false;
    let IOSupported = false;
    let fadeIn = props.fadeIn; // If this image has already been loaded before then we can assume it's
    // already in the browser cache so it's cheap to just show directly.

    const seenBefore = inImageCache(props); // browser with Intersection Observer available

    if (!seenBefore && typeof window !== `undefined` && window.IntersectionObserver) {
      isVisible = false;
      IOSupported = true;
    } // Never render image during SSR


    if (typeof window === `undefined`) {
      isVisible = false;
    } // Force render for critical images


    if (props.critical) {
      isVisible = true;
      IOSupported = false;
    }

    const hasNoScript = !(this.props.critical && !this.props.fadeIn);
    this.state = {
      isVisible,
      imgLoaded,
      IOSupported,
      fadeIn,
      hasNoScript,
      seenBefore
    };
    this.bgImage = ``; // Get background(-*) styles from CSS (e.g. Styled Components).

    this.backgroundStyles = (0, _BackgroundUtils.default)(this.props.className);
    this.imageRef = _react.default.createRef();
    this.handleImageLoaded = this.handleImageLoaded.bind(this);
    this.handleRef = this.handleRef.bind(this);
  }

  componentDidMount() {
    if (this.state.isVisible && typeof this.props.onStartLoad === `function`) {
      this.props.onStartLoad({
        wasCached: inImageCache(this.props)
      });
    }

    if (this.props.critical) {
      const img = this.imageRef.current;

      if (img && img.complete) {
        this.handleImageLoaded();
      }
    }
  }

  handleRef(ref) {
    if (this.state.IOSupported && ref) {
      listenToIntersections(ref, () => {
        if (!this.state.isVisible && typeof this.props.onStartLoad === `function`) {
          this.props.onStartLoad({
            wasCached: inImageCache(this.props)
          });
        }

        this.setState({
          isVisible: true,
          imgLoaded: false
        });
      });
    }
  }

  handleImageLoaded() {
    activateCacheForImage(this.props);
    this.setState({
      imgLoaded: true
    });

    if (this.state.seenBefore) {
      this.setState({
        fadeIn: false
      });
    }

    this.props.onLoad && this.props.onLoad();
  }

  render() {
    const _convertProps = convertProps(this.props),
          title = _convertProps.title,
          alt = _convertProps.alt,
          className = _convertProps.className,
          _convertProps$style = _convertProps.style,
          style = _convertProps$style === void 0 ? {} : _convertProps$style,
          _convertProps$imgStyl = _convertProps.imgStyle,
          imgStyle = _convertProps$imgStyl === void 0 ? {} : _convertProps$imgStyl,
          _convertProps$placeho = _convertProps.placeholderStyle,
          placeholderStyle = _convertProps$placeho === void 0 ? {} : _convertProps$placeho,
          placeholderClassName = _convertProps.placeholderClassName,
          fluid = _convertProps.fluid,
          fixed = _convertProps.fixed,
          backgroundColor = _convertProps.backgroundColor,
          Tag = _convertProps.Tag,
          _convertProps$classId = _convertProps.classId,
          classId = _convertProps$classId === void 0 ? Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 7) : _convertProps$classId,
          children = _convertProps.children;

    const bgColor = typeof backgroundColor === `boolean` ? `lightgray` : backgroundColor;
    const imagePlaceholderStyle = Object.assign({
      opacity: this.state.imgLoaded ? 0 : 1,
      transition: `opacity 0.5s`,
      transitionDelay: this.state.imgLoaded ? `0.5s` : `0.25s`
    }, imgStyle, placeholderStyle);
    const imageStyle = Object.assign({
      opacity: this.state.imgLoaded || this.state.fadeIn === false ? 1 : 0,
      transition: this.state.fadeIn === true ? `opacity 0.5s` : `none`
    }, imgStyle);
    const placeholderImageProps = {
      title,
      alt: !this.state.isVisible ? alt : ``,
      style: Object.assign({}, imagePlaceholderStyle, {
        // Prevent Gatsby Image from being shown, as we only need it for the Backgrounds.
        display: `none`
      }),
      className: placeholderClassName
    };
    const backgroundSize = this.backgroundStyles.hasOwnProperty(`backgroundSize`) ? this.backgroundStyles.backgroundSize : `cover`;
    const backgroundRepeat = `background-repeat: ${this.backgroundStyles.hasOwnProperty(`backgroundRepeat`) ? this.backgroundStyles.backgroundRepeat : `no-repeat`};`;
    const transitionDelay = this.state.imgLoaded ? `0.5s` : `0.25s`;

    if (fluid) {
      const image = fluid; // Set the backgroundImage according to images available.

      let bgImage = this.bgImage,
          nextImage = ``;
      if (image.tracedSVG) nextImage = `'${image.tracedSVG}'`;
      if (image.base64 && !image.tracedSVG) nextImage = image.base64;
      if (this.state.isVisible) nextImage = image.src; // Switch bgImage & nextImage and opacity accordingly.

      bgImage = bgImage === `` ? nextImage : ``;
      const afterOpacity = nextImage !== bgImage ? 1 : 0;
      this.bgImage = bgImage;
      return _react.default.createElement(Tag, {
        className: `${className ? className : ``} gatsby-background-image-${classId} gatsby-image-wrapper`,
        style: Object.assign({
          position: `relative`,
          overflow: `hidden`
        }, style, this.backgroundStyles),
        ref: this.handleRef,
        key: `fluid-${JSON.stringify(image.srcSet)}`
      }, _react.default.createElement("style", {
        dangerouslySetInnerHTML: {
          __html: `
                .gatsby-background-image-${classId}:before,
                .gatsby-background-image-${classId}:after {
                  background-size: ${backgroundSize};
                  content: '';
                  display: block;
                  position: absolute;
                  width: 100%;
                  height: 100%;
                  top: 0;
                  left: 0;
                  transition: opacity ${transitionDelay} ease-in-out;
                  -webkit-transition: opacity ${transitionDelay} ease-in-out;
                  -moz-transition: opacity ${transitionDelay} ease-in-out;
                  -o-transition: opacity ${transitionDelay} ease-in-out;
                }
                .gatsby-background-image-${classId}:before {
                  z-index: -101;
                  background-image: url(${bgImage});
                  ${backgroundRepeat}
                }
                .gatsby-background-image-${classId}:after {
                  z-index: -100;
                  background-image: url(${nextImage});
                  ${backgroundRepeat}
                  content: "";
                  opacity: ${afterOpacity};
                }
              `
        }
      }), image.base64 && _react.default.createElement(Img, (0, _extends2.default)({
        alt: !this.state.isVisible ? alt : ``,
        title: title,
        src: image.base64,
        style: Object.assign({}, imagePlaceholderStyle, {
          // Prevent Gatsby Image from being shown, as we only need it for the Backgrounds.
          display: `none`
        })
      }, placeholderImageProps)), image.tracedSVG && _react.default.createElement(Img, (0, _extends2.default)({
        alt: !this.state.isVisible ? alt : ``,
        title: title,
        src: image.tracedSVG,
        style: Object.assign({}, imagePlaceholderStyle, {
          // Prevent Gatsby Image from being shown, as we only need it for the Backgrounds.
          display: `none`
        })
      }, placeholderImageProps)), bgColor && _react.default.createElement(Tag, {
        title: title,
        style: {
          backgroundColor: bgImage === `` ? bgColor : ``,
          backgroundSize: backgroundSize,
          zIndex: -103,
          width: image.width,
          opacity: !this.state.imgLoaded ? 1 : 0,
          transitionDelay: `0.25s`,
          height: image.height
        }
      }), this.state.isVisible && _react.default.createElement("picture", {
        style: {
          // Prevent Gatsby Image from being shown, as we only need it for the Backgrounds.
          display: `none`
        }
      }, image.srcSetWebp && _react.default.createElement("source", {
        type: `image/webp`,
        srcSet: image.srcSetWebp,
        sizes: image.sizes
      }), _react.default.createElement("source", {
        srcSet: image.srcSet,
        sizes: image.sizes
      }), _react.default.createElement(Img, {
        alt: alt,
        title: title,
        src: image.src,
        style: imageStyle,
        ref: this.imageRef,
        onLoad: this.handleImageLoaded,
        onError: this.props.onError
      })), this.state.hasNoScript && _react.default.createElement("noscript", {
        dangerouslySetInnerHTML: {
          __html: noscriptImg(Object.assign({
            alt,
            title
          }, image))
        }
      }), children);
    }

    if (fixed) {
      const image = fixed;
      const divStyle = Object.assign({
        position: `relative`,
        overflow: `hidden`,
        display: `inline-block`,
        width: image.width,
        height: image.height
      }, style);

      if (style.display === `inherit`) {
        delete divStyle.display;
      } // Set the backgroundImage according to images available.


      let bgImage = this.bgImage,
          nextImage = ``;
      if (image.tracedSVG) nextImage = `'${image.tracedSVG}'`;
      if (image.base64 && !image.tracedSVG) nextImage = image.base64;
      if (this.state.isVisible) nextImage = image.src; // Switch bgImage & nextImage and opacity accordingly.

      bgImage = bgImage === `` ? nextImage : ``;
      const afterOpacity = nextImage !== bgImage ? 1 : 0;
      this.bgImage = bgImage;
      return _react.default.createElement(Tag, {
        className: `${className ? className : ``} gatsby-background-image-${classId} gatsby-image-wrapper`,
        style: Object.assign({
          position: `relative`,
          overflow: `hidden`
        }, style, this.backgroundStyles),
        ref: this.handleRef,
        key: `fixed-${JSON.stringify(image.srcSet)}`
      }, _react.default.createElement("style", {
        dangerouslySetInnerHTML: {
          __html: `
                .gatsby-background-image-${classId}:before,
                .gatsby-background-image-${classId}:after {
                  background-size: ${backgroundSize};
                  content: '';
                  display: block;
                  position: absolute;
                  width: 100%;
                  height: 100%;
                  top: 0;
                  left: 0;
                  transition: opacity ${transitionDelay} ease-in-out;
                  -webkit-transition: opacity ${transitionDelay} ease-in-out;
                  -moz-transition: opacity ${transitionDelay} ease-in-out;
                  -o-transition: opacity ${transitionDelay} ease-in-out;
                }
                .gatsby-background-image-${classId}:before {
                  z-index: -101;
                  background-image: url(${bgImage});
                  ${backgroundRepeat}
                }
                .gatsby-background-image-${classId}:after {
                  z-index: -100;
                  background-image: url(${nextImage});
                  ${backgroundRepeat}
                  content: "";
                  opacity: ${afterOpacity};
                }
              `
        }
      }), image.base64 && _react.default.createElement(Img, (0, _extends2.default)({
        alt: !this.state.isVisible ? alt : ``,
        title: title,
        src: image.base64,
        style: Object.assign({}, imagePlaceholderStyle, {
          // Prevent Gatsby Image from being shown, as we only need it for the Backgrounds.
          display: `none`
        })
      }, placeholderImageProps)), image.tracedSVG && _react.default.createElement(Img, (0, _extends2.default)({
        alt: !this.state.isVisible ? alt : ``,
        title: title,
        src: image.tracedSVG,
        style: Object.assign({}, imagePlaceholderStyle, {
          // Prevent Gatsby Image from being shown, as we only need it for the Backgrounds.
          display: `none`
        })
      }, placeholderImageProps)), bgColor && _react.default.createElement(Tag, {
        title: title,
        style: {
          backgroundColor: bgImage === `` ? bgColor : ``,
          backgroundSize: backgroundSize,
          zIndex: -103,
          width: image.width,
          opacity: !this.state.imgLoaded ? 1 : 0,
          transitionDelay: `0.25s`,
          height: image.height
        }
      }), this.state.isVisible && _react.default.createElement("picture", {
        style: {
          // Prevent Gatsby Image from being shown, as we only need it for the Backgrounds.
          display: `none`
        }
      }, image.srcSetWebp && _react.default.createElement("source", {
        type: `image/webp`,
        srcSet: image.srcSetWebp,
        sizes: image.sizes
      }), _react.default.createElement("source", {
        srcSet: image.srcSet,
        sizes: image.sizes
      }), _react.default.createElement(Img, {
        alt: alt,
        title: title,
        width: image.width,
        height: image.height,
        src: image.src,
        style: imageStyle,
        ref: this.imageRef,
        onLoad: this.handleImageLoaded,
        onError: this.props.onError
      })), this.state.hasNoScript && _react.default.createElement("noscript", {
        dangerouslySetInnerHTML: {
          __html: noscriptImg(Object.assign({
            alt,
            title,
            width: image.width,
            height: image.height
          }, image))
        }
      }));
    }

    return null;
  }

}

BackgroundImage.defaultProps = {
  critical: false,
  fadeIn: true,
  alt: ``,
  Tag: `div`
};

const fixedObject = _propTypes.default.shape({
  width: _propTypes.default.number.isRequired,
  height: _propTypes.default.number.isRequired,
  src: _propTypes.default.string.isRequired,
  srcSet: _propTypes.default.string.isRequired,
  base64: _propTypes.default.string,
  tracedSVG: _propTypes.default.string,
  srcWebp: _propTypes.default.string,
  srcSetWebp: _propTypes.default.string
});

const fluidObject = _propTypes.default.shape({
  aspectRatio: _propTypes.default.number.isRequired,
  src: _propTypes.default.string.isRequired,
  srcSet: _propTypes.default.string.isRequired,
  sizes: _propTypes.default.string.isRequired,
  base64: _propTypes.default.string,
  tracedSVG: _propTypes.default.string,
  srcWebp: _propTypes.default.string,
  srcSetWebp: _propTypes.default.string
});

BackgroundImage.propTypes = {
  resolutions: fixedObject,
  sizes: fluidObject,
  fixed: fixedObject,
  fluid: fluidObject,
  fadeIn: _propTypes.default.bool,
  title: _propTypes.default.string,
  alt: _propTypes.default.string,
  className: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.object]),
  // Support Glamor's css prop.
  critical: _propTypes.default.bool,
  style: _propTypes.default.object,
  imgStyle: _propTypes.default.object,
  placeholderStyle: _propTypes.default.object,
  placeholderClassName: _propTypes.default.string,
  backgroundColor: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.bool]),
  onLoad: _propTypes.default.func,
  onError: _propTypes.default.func,
  onStartLoad: _propTypes.default.func,
  Tag: _propTypes.default.string,
  classId: _propTypes.default.string
};
var _default = BackgroundImage;
exports.default = _default;