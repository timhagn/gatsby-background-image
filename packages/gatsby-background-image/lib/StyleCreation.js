"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.createNoScriptStyles = exports.createPseudoStyles = exports.createPseudoElement = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _HelperUtils = require("./HelperUtils");

var _StyleUtils = require("./StyleUtils");

var _ImageUtils = require("./ImageUtils");

var _MediaUtils = require("./MediaUtils");

var createPseudoElement = function createPseudoElement(className, classId, appendix) {
  if (classId === void 0) {
    classId = "";
  }

  if (appendix === void 0) {
    appendix = ":before";
  }

  var escapedClassName = (0, _StyleUtils.escapeClassNames)(className);
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


exports.createPseudoElement = createPseudoElement;

var createPseudoStyles = function createPseudoStyles(_ref) {
  var classId = _ref.classId,
      className = _ref.className,
      transitionDelay = _ref.transitionDelay,
      lastImage = _ref.lastImage,
      nextImage = _ref.nextImage,
      afterOpacity = _ref.afterOpacity,
      bgColor = _ref.bgColor,
      fadeIn = _ref.fadeIn,
      backgroundStyles = _ref.backgroundStyles,
      style = _ref.style,
      finalImage = _ref.finalImage;
  var pseudoBefore = createPseudoElement(className, classId);
  var pseudoAfter = createPseudoElement(className, classId, ":after");
  return "\n          " + pseudoBefore + ",\n          " + pseudoAfter + " {\n            content: '';\n            display: block;\n            position: absolute;\n            width: 100%;\n            height: 100%;\n            top: 0;\n            left: 0;\n            " + (bgColor && "background-color: " + bgColor + ";") + "\n            " + (0, _StyleUtils.setTransitionStyles)(transitionDelay, fadeIn) + "\n            " + (0, _StyleUtils.kebabifyBackgroundStyles)((0, _extends2.default)({}, backgroundStyles, {}, style)) + "\n          }\n          " + pseudoBefore + " {\n            z-index: -100;\n            " + (afterOpacity && nextImage ? "background-image: " + nextImage + ";" : "") + "\n            " + (!afterOpacity && lastImage ? "background-image: " + lastImage + ";" : "") + "\n            opacity: " + afterOpacity + "; \n          }\n          " + pseudoAfter + " {\n            z-index: -101;\n            " + (!afterOpacity && nextImage ? "background-image: " + nextImage + ";" : "") + "\n            " + (afterOpacity && lastImage ? "background-image: " + lastImage + ";" : "") + "\n            " + (finalImage ? "opacity: " + Number(!afterOpacity) + ";" : "") + "\n          }\n        ";
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

var createNoScriptStyles = function createNoScriptStyles(_ref2) {
  var classId = _ref2.classId,
      className = _ref2.className,
      image = _ref2.image;

  if (image) {
    var returnArray = Array.isArray(image) && !(0, _MediaUtils.hasArtDirectionArray)({
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