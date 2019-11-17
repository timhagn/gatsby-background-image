"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = exports.getBackgroundStylesForSingleClass = exports.getStyleRules = exports.rulesForCssText = exports.getStyle = void 0;

var _assign = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/assign"));

var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));

var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));

var _values = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/values"));

var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));

var _indexOf = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/index-of"));

var _slice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/slice"));

var _reduce = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/reduce"));

var _HelperUtils = require("./HelperUtils");

var getStyle = function getStyle(className) {
  var styleSheets = typeof window !== "undefined" ? window.document.styleSheets : [];

  for (var i = 0; i < styleSheets.length; i++) {
    var _context;

    var classes = void 0;

    try {
      classes = typeof styleSheets[i].rules !== 'undefined' ? styleSheets[i].rules : typeof styleSheets[i].cssRules !== 'undefined' ? styleSheets[i].cssRules : '';
    } catch (e) {}

    if (!classes) continue;
    var foundClass = (0, _reduce.default)(_context = (0, _slice.default)(Array.prototype).call(classes)).call(_context, function (foundAcc, styleRule) {
      return styleRule.selectorText === className && foundAcc === "" ? styleRule : foundAcc;
    }, "");

    if (foundClass) {
      var resultingStyleText = foundClass.cssText ? foundClass.cssText : foundClass.style.cssText;
      return (0, _indexOf.default)(resultingStyleText).call(resultingStyleText, foundClass.selectorText) === -1 ? foundClass.selectorText + "{" + resultingStyleText + "}" : resultingStyleText;
    }
  }
};
/**
 * Creates a temporary style element to read rules from.
 *
 * @param styleContent  string    CSS-Styles to apply
 * @return {*}
 */


exports.getStyle = getStyle;

var rulesForCssText = function rulesForCssText(styleContent) {
  if (typeof document !== "undefined" && styleContent) {
    var doc = document.implementation.createHTMLDocument('');
    var styleElement = document.createElement('style');
    styleElement.textContent = styleContent; // The style element will only be parsed once it is added to a document.

    doc.body.appendChild(styleElement);
    return styleElement.sheet.cssRules;
  }

  return {};
};
/**
 * Fixes non-enumerable style rules in Firefox.
 *
 * @param cssStyleRules CSSStyleRules   DOM-StyleRules-Object
 * @return {*}
 */


exports.rulesForCssText = rulesForCssText;

var getStyleRules = function getStyleRules(cssStyleRules) {
  var _context2;

  var styles = {};

  if (cssStyleRules.length > 0 && typeof cssStyleRules[0].style !== 'undefined') {
    // Fallback for Browsers without constructor.name (IE11).
    var constructorName = cssStyleRules[0].style.constructor.name || cssStyleRules[0].style.constructor.toString();

    switch (constructorName) {
      // For Firefox or IE11.
      case 'CSS2Properties':
      case '[object MSStyleCSSProperties]':
        (0, _forEach.default)(_context2 = (0, _values.default)(cssStyleRules[0].style)).call(_context2, function (prop) {
          styles[(0, _HelperUtils.toCamelCase)(prop)] = cssStyleRules[0].style[prop];
        });
        break;

      case 'CSSStyleDeclaration':
        styles = cssStyleRules[0].style;
        break;

      default:
        console.error('Unknown style object prototype');
        break;
    }
  }

  return styles;
};
/**
 * Filters out Background Rules for a given class Name.
 *
 * @param className   string    The class to filter rules from
 * @return {{}}
 */


exports.getStyleRules = getStyleRules;

var getBackgroundStylesForSingleClass = function getBackgroundStylesForSingleClass(className) {
  if ((0, _HelperUtils.isString)(className)) {
    var style = getStyle("." + className);
    var cssStyleRules = rulesForCssText(style);

    if (cssStyleRules.length > 0 && typeof cssStyleRules[0].style !== 'undefined') {
      var _context3, _context4;

      // Filter out background(-*) rules that contain a definition.
      return (0, _reduce.default)(_context3 = (0, _filter.default)(_context4 = (0, _keys.default)(getStyleRules(cssStyleRules))).call(_context4, function (key) {
        return (0, _indexOf.default)(key).call(key, 'background') === 0 && cssStyleRules[0].style[key] !== '';
      })).call(_context3, function (newData, key) {
        newData[key] = cssStyleRules[0].style[key];
        return newData;
      }, {});
    }
  }

  return {};
};
/**
 * Uses the above to get all background(-*) rules from given class(es).
 *
 * @param className   string|array    className or array of classNames
 * @return {*}
 */


exports.getBackgroundStylesForSingleClass = getBackgroundStylesForSingleClass;

var getBackgroundStyles = function getBackgroundStyles(className) {
  if (typeof window !== "undefined") {
    var classes = (0, _HelperUtils.stringToArray)(className);

    if (classes instanceof Array) {
      var classObjects = [];
      (0, _forEach.default)(classes).call(classes, function (item) {
        return classObjects.push(getBackgroundStylesForSingleClass(item));
      });
      return _assign.default.apply(Object, classObjects);
    }

    return getBackgroundStylesForSingleClass(className);
  }

  return {};
};

var _default = getBackgroundStyles;
exports.default = _default;