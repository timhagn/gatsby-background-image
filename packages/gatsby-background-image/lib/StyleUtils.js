"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.createNoScriptStyles = exports.createPseudoStyles = exports.presetBackgroundStyles = exports.fixOpacity = exports.setTransitionStyles = exports.kebabifyBackgroundStyles = exports.escapeClassNames = exports.fixClassName = exports.createPseudoElement = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _shortUuid = _interopRequireDefault(require("short-uuid"));

var _HelperUtils = require("./HelperUtils");

var _ImageUtils = require("./ImageUtils");

var _ClassCache = require("./ClassCache");

var createPseudoElement = function createPseudoElement(className, classId, appendix) {
  if (classId === void 0) {
    classId = "";
  }

  if (appendix === void 0) {
    appendix = ":before";
  }

  var escapedClassName = escapeClassNames(className);
  var classes = (0, _HelperUtils.stringToArray)(escapedClassName);
  var pseudoClasses = "";

  if (classes instanceof Array && classes.length > 0 && classes[0] !== "") {
    pseudoClasses = "." + classes.join('.') + appendix;
  }

  if (classId !== "") {
    pseudoClasses += (pseudoClasses && ",\n") + ".gatsby-background-image-" + classId + appendix;
  }

  return pseudoClasses;
};
/**
 * Checks if an element with given className(s) already exists.
 *
 * @param className       string    Given className(s) e.g. from styled-components
 * @param props           Object    Given props by component
 * @return {*[]}
 */


exports.createPseudoElement = createPseudoElement;

var fixClassName = function fixClassName(_ref) {
  var className = _ref.className,
      props = (0, _objectWithoutPropertiesLoose2.default)(_ref, ["className"]);
  // const escapedClassName = escapeClassNames(className)
  var convertedProps = (0, _HelperUtils.convertProps)(props);
  var elementExists = (0, _ClassCache.inComponentClassCache)(className); // Extract imageData.

  var imageData = (0, _HelperUtils.getCurrentSrcData)(convertedProps); // Add an additional unique class for multiple <BackgroundImage>s.

  var additionalClassname = _shortUuid.default.generate(); // Create random "uniquely hashed" additionalClass if needed.


  var randomClass = " gbi-" + (0, _HelperUtils.hashString)(imageData && imageData.srcSet || className) + "-" + additionalClassname; // Should an element exist, add randomized class.

  var additionalClass = elementExists ? randomClass : "";
  var componentClassNames = ("" + (className || "") + (additionalClass || "")).trim(); // Add it to cache if it doesn't exist.

  if (!elementExists) (0, _ClassCache.activateCacheForComponentClass)(className);
  return [componentClassNames];
};
/**
 * Escapes specialChars defined in gatsby-config.js in classNames to make
 * Tailwind CSS or suchlike usable (defaults to: `:/`).
 *
 * @param classNames           classNames to escape.
 * @return {void | string|*}
 */


exports.fixClassName = fixClassName;

var escapeClassNames = function escapeClassNames(classNames) {
  if (classNames) {
    var specialChars = (0, _HelperUtils.isBrowser)() && window._gbiSpecialChars ? window._gbiSpecialChars : typeof __GBI_SPECIAL_CHARS__ !== "undefined" ? __GBI_SPECIAL_CHARS__ : ':/';
    var specialCharRegEx = new RegExp("[" + specialChars + "]", 'g');
    return classNames.replace(specialCharRegEx, '\\$&');
  }

  return classNames;
};
/**
 * Converts a style object into CSS kebab-cased style rules.
 *
 * @param styles    Object  Style object to convert
 * @return {*}
 */


exports.escapeClassNames = escapeClassNames;

var kebabifyBackgroundStyles = function kebabifyBackgroundStyles(styles) {
  if ((0, _HelperUtils.isString)(styles)) {
    return styles;
  }

  if (styles instanceof Object) {
    return Object.keys(styles).filter(function (key) {
      return key.indexOf('background') === 0 && styles[key] !== '';
    }).reduce(function (resultingStyles, key) {
      return "" + resultingStyles + (0, _HelperUtils.toKebabCase)(key) + ": " + styles[key] + ";\n";
    }, "");
  }

  return "";
};
/**
 * Creates vendor prefixed background styles.
 *
 * @param transitionDelay   string    Time delay before transitioning
 * @param fadeIn            boolean   Should we transition?
 * @return {string}
 */


exports.kebabifyBackgroundStyles = kebabifyBackgroundStyles;

var setTransitionStyles = function setTransitionStyles(transitionDelay, fadeIn) {
  if (transitionDelay === void 0) {
    transitionDelay = "0.25s";
  }

  if (fadeIn === void 0) {
    fadeIn = true;
  }

  return fadeIn ? "transition: opacity 0.5s ease " + transitionDelay + ";" : "transition: none;";
};
/**
 * Prevent possible stacking order mismatch with opacity "hack".
 *
 * @param props     Object    Given props by component
 * @return {Object}
 */


exports.setTransitionStyles = setTransitionStyles;

var fixOpacity = function fixOpacity(props) {
  var styledProps = (0, _extends2.default)({}, props);

  if (!styledProps.preserveStackingContext) {
    try {
      if (styledProps.style && styledProps.style.opacity) {
        if (isNaN(styledProps.style.opacity) || styledProps.style.opacity > 0.99) {
          styledProps.style.opacity = 0.99;
        }
      }
    } catch (e) {// Continue regardless of error
    }
  }

  return styledProps;
};
/**
 * Set some needed backgroundStyles.
 *
 * @param backgroundStyles  object    Special background styles to be spread
 * @return {Object}
 */


exports.fixOpacity = fixOpacity;

var presetBackgroundStyles = function presetBackgroundStyles(backgroundStyles) {
  var defaultBackgroundStyles = {
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover"
  };
  return (0, _extends2.default)({}, defaultBackgroundStyles, {}, backgroundStyles);
};
/**
 * Creates styles for the changing pseudo-elements' backgrounds.
 *
 * @param classId           string    Pre 0.3.0 way to create pseudo-elements
 * @param className         string    One or more className(s)
 * @param transitionDelay   string    Time delay before transitioning
 * @param lastImage         string    The last image given
 * @param nextImage         string    The next image to show
 * @param afterOpacity      number    The opacity of the pseudo-element upfront
 * @param bgColor           string    A possible background-color to set
 * @param fadeIn            boolean   Should we transition?
 * @param backgroundStyles  object    Special background styles to be spread
 * @param style             object    Default style to be spread
 * @param finalImage        boolean   Have we reached the last image?
 * @return {string}
 */


exports.presetBackgroundStyles = presetBackgroundStyles;

var createPseudoStyles = function createPseudoStyles(_ref2) {
  var classId = _ref2.classId,
      className = _ref2.className,
      transitionDelay = _ref2.transitionDelay,
      lastImage = _ref2.lastImage,
      nextImage = _ref2.nextImage,
      afterOpacity = _ref2.afterOpacity,
      bgColor = _ref2.bgColor,
      fadeIn = _ref2.fadeIn,
      backgroundStyles = _ref2.backgroundStyles,
      style = _ref2.style,
      finalImage = _ref2.finalImage;
  var pseudoBefore = createPseudoElement(className, classId);
  var pseudoAfter = createPseudoElement(className, classId, ":after");
  return "\n          " + pseudoBefore + ",\n          " + pseudoAfter + " {\n            content: '';\n            display: block;\n            position: absolute;\n            width: 100%;\n            height: 100%;\n            top: 0;\n            left: 0;\n            " + (bgColor && "background-color: " + bgColor + ";") + "\n            " + setTransitionStyles(transitionDelay, fadeIn) + "\n            " + kebabifyBackgroundStyles((0, _extends2.default)({}, backgroundStyles, {}, style)) + "\n          }\n          " + pseudoBefore + " {\n            z-index: -100;\n            " + (afterOpacity && nextImage ? "background-image: " + nextImage + ";" : "") + "\n            " + (!afterOpacity && lastImage ? "background-image: " + lastImage + ";" : "") + "\n            opacity: " + afterOpacity + "; \n          }\n          " + pseudoAfter + " {\n            z-index: -101;\n            " + (!afterOpacity && nextImage ? "background-image: " + nextImage + ";" : "") + "\n            " + (afterOpacity && lastImage ? "background-image: " + lastImage + ";" : "") + "\n            " + (finalImage ? "opacity: " + Number(!afterOpacity) + ";" : "") + "\n          }\n        ";
};
/**
 * Creates styles for the noscript element.
 *
 * @param classId     string          Pre 0.3.0 way to create pseudo-elements
 * @param className   string          One or more className(s)
 * @param image       string||array   Base data for one or multiple Images
 * @return {string}
 */


exports.createPseudoStyles = createPseudoStyles;

var createNoScriptStyles = function createNoScriptStyles(_ref3) {
  var classId = _ref3.classId,
      className = _ref3.className,
      image = _ref3.image;

  if (image) {
    var returnArray = Array.isArray(image) && !(0, _HelperUtils.hasArtDirectionArray)({
      fluid: image
    });
    var addUrl = false;
    var allSources = (0, _ImageUtils.getCurrentFromData)({
      data: image,
      propName: "src",
      checkLoaded: false,
      addUrl: addUrl,
      returnArray: returnArray
    });
    var sourcesAsUrl = (0, _ImageUtils.getUrlString)({
      imageString: allSources,
      hasImageUrls: true,
      returnArray: returnArray
    });
    var sourcesAsUrlWithCSS = "";

    if (returnArray) {
      var cssStrings = (0, _ImageUtils.getCurrentFromData)({
        data: image,
        propName: "CSS_STRING",
        addUrl: false,
        returnArray: returnArray
      });
      sourcesAsUrlWithCSS = (0, _HelperUtils.filteredJoin)((0, _HelperUtils.combineArray)(sourcesAsUrl, cssStrings));
    }

    var pseudoBefore = createPseudoElement(className, classId);
    return "\n          " + pseudoBefore + " {\n            opacity: 1;\n            background-image: " + (sourcesAsUrlWithCSS || sourcesAsUrl) + ";\n          }";
  }

  return "";
};

exports.createNoScriptStyles = createNoScriptStyles;