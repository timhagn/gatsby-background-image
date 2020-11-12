/**
 * Gets styles by a class name.
 *
 * @notice The className has to exactly match the CSS class
 * @param className string
 */
import { isBrowser, isString, stringToArray, toCamelCase } from './SimpleUtils';

/**
 * Gets styles rules by a class name.
 *
 * @notice The className has to exactly match the CSS class
 * @param className string
 */
export const getStyleRulesForClassName = className => {
  const styleSheets = isBrowser() ? window.document.styleSheets : [];
  for (let i = 0; i < styleSheets.length; i++) {
    let classes;
    try {
      classes =
        typeof styleSheets[i].rules !== 'undefined'
          ? styleSheets[i].rules
          : typeof styleSheets[i].cssRules !== 'undefined'
          ? styleSheets[i].cssRules
          : '';
    } catch (e) {}
    if (classes) {
      const foundClass = Array.prototype.slice
        .call(classes)
        .reduce((foundAcc, styleRule) => {
          if (styleRule.selectorText === className) {
            foundAcc.push(styleRule);
          }
          return foundAcc;
        }, []);
      if (foundClass.length) {
        return foundClass;
      }
    }
  }
  return [];
};

/**
 * Fixes non-enumerable style rules in Firefox.
 *
 * @param cssStyleRules CSSStyleRules   DOM-StyleRules-Object
 * @return {*}
 */
export const getStyleRules = cssStyleRules => {
  let styles = {};
  if (
    cssStyleRules.length > 0 &&
    typeof cssStyleRules[0].style !== 'undefined'
  ) {
    // Fallback for Browsers without constructor.name (IE11).
    const constructorName =
      cssStyleRules[0].style.constructor.name ||
      cssStyleRules[0].style.constructor.toString();

    switch (constructorName) {
      // For Firefox or IE11.
      case 'CSS2Properties':
      case '[object MSStyleCSSProperties]':
        Object.values(cssStyleRules[0].style).forEach(prop => {
          styles[toCamelCase(prop)] = cssStyleRules[0].style[prop];
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
export const getBackgroundStylesForSingleClass = className => {
  if (className && isString(className)) {
    const cssStyleRules = getStyleRulesForClassName(`.${className}`);
    // const cssStyleRules = rulesForCssText(style)

    if (
      cssStyleRules?.length > 0 &&
      typeof cssStyleRules[0].style !== 'undefined'
    ) {
      // Filter out background(-*) rules that contain a definition.
      return Object.keys(getStyleRules(cssStyleRules))
        .filter(
          key =>
            key.indexOf('background') === 0 &&
            cssStyleRules[0].style[key] !== ''
        )
        .reduce((newData, key) => {
          newData[toCamelCase(key)] = cssStyleRules[0].style[key];
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
const getBackgroundStyles = className => {
  if (isBrowser()) {
    const classes = stringToArray(className);
    if (classes instanceof Array) {
      const classObjects = [];
      classes.forEach(item =>
        classObjects.push(getBackgroundStylesForSingleClass(item))
      );
      return Object.assign(...classObjects);
    }
    return getBackgroundStylesForSingleClass(className);
  }
  return {};
};

export default getBackgroundStyles;
