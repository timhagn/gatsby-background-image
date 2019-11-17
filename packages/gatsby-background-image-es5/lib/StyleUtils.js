"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.presetBackgroundStyles = exports.fixOpacity = exports.setTransitionStyles = exports.kebabifyBackgroundStyles = exports.escapeClassNames = exports.fixClassName = void 0;

var _assign = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/assign"));

var _indexOf = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/index-of"));

var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));

var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));

var _reduce = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/reduce"));

var _trim = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/trim"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/objectWithoutPropertiesLoose"));

var _shortUuid = _interopRequireDefault(require("short-uuid"));

var _HelperUtils = require("./HelperUtils");

var _ClassCache = require("./ClassCache");

var _ImageUtils = require("./ImageUtils");

var _SimpleUtils = require("./SimpleUtils");

var fixClassName = function fixClassName(_ref) {
  var _context;

  var className = _ref.className,
      props = (0, _objectWithoutPropertiesLoose2.default)(_ref, ["className"]);
  // const escapedClassName = escapeClassNames(className)
  var convertedProps = (0, _HelperUtils.convertProps)(props);
  var elementExists = (0, _ClassCache.inComponentClassCache)(className); // Extract imageData.

  var imageData = (0, _ImageUtils.getCurrentSrcData)(convertedProps); // Add an additional unique class for multiple <BackgroundImage>s.

  var additionalClassname = _shortUuid.default.generate(); // Create random "uniquely hashed" additionalClass if needed.


  var randomClass = " gbi-" + (0, _SimpleUtils.hashString)(imageData && imageData.srcSet || className) + "-" + additionalClassname; // Should an element exist, add randomized class.

  var additionalClass = elementExists ? randomClass : "";
  var componentClassNames = (0, _trim.default)(_context = "" + (className || "") + (additionalClass || "")).call(_context); // Add it to cache if it doesn't exist.

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
    var specialChars = (0, _SimpleUtils.isBrowser)() && window._gbiSpecialChars ? window._gbiSpecialChars : typeof __GBI_SPECIAL_CHARS__ !== "undefined" ? __GBI_SPECIAL_CHARS__ : ':/';
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
  if ((0, _SimpleUtils.isString)(styles)) {
    return styles;
  }

  if (styles instanceof Object) {
    var _context2, _context3;

    return (0, _reduce.default)(_context2 = (0, _filter.default)(_context3 = (0, _keys.default)(styles)).call(_context3, function (key) {
      return (0, _indexOf.default)(key).call(key, 'background') === 0 && styles[key] !== '';
    })).call(_context2, function (resultingStyles, key) {
      return "" + resultingStyles + (0, _SimpleUtils.toKebabCase)(key) + ": " + styles[key] + ";\n";
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
  var styledProps = (0, _assign.default)({}, props);

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
  return (0, _assign.default)({}, defaultBackgroundStyles, {}, backgroundStyles);
};

exports.presetBackgroundStyles = presetBackgroundStyles;