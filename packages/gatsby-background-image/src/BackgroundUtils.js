import { toCamelCase } from './HelperUtils'

/**
 * Gets styles by a class name.
 *
 * @notice The className has to exactly match the CSS class
 * @param className string
 */
export const getStyle = className => {
  const styleSheets =
    typeof window !== `undefined` ? window.document.styleSheets : []
  for (let i = 0; i < styleSheets.length; i++) {
    let classes
    try {
      classes =
        typeof styleSheets[i].rules !== 'undefined'
          ? styleSheets[i].rules
          : typeof styleSheets[i].cssRules !== 'undefined'
          ? styleSheets[i].cssRules
          : ''
    } catch (e) {}
    if (!classes) continue
    for (let x = 0; x < classes.length; x++) {
      if (classes[x].selectorText === className) {
        const resultingStyleText = classes[x].cssText
          ? classes[x].cssText
          : classes[x].style.cssText
        return resultingStyleText.indexOf(classes[x].selectorText) === -1
          ? `${classes[x].selectorText}{${resultingStyleText}}`
          : resultingStyleText
      }
    }
  }
}

/**
 * Creates a temporary style element to read rules from.
 *
 * @param styleContent  string    CSS-Styles to apply
 * @return {*}
 */
export const rulesForCssText = styleContent => {
  if (typeof document !== `undefined` && styleContent) {
    const doc = document.implementation.createHTMLDocument(''),
      styleElement = document.createElement('style')

    styleElement.textContent = styleContent
    // The style element will only be parsed once it is added to a document.
    doc.body.appendChild(styleElement)

    return styleElement.sheet.cssRules
  }
  return {}
}

/**
 * Fixes non-enumerable style rules in Firefox.
 *
 * @param cssStyleRules CSSStyleRules   DOM-StyleRules-Object
 * @return {*}
 */
export const getStyleRules = cssStyleRules => {
  let styles = {}
  if (
    cssStyleRules.length > 0 &&
    typeof cssStyleRules[0].style !== 'undefined'
  ) {
    switch (cssStyleRules[0].style.constructor.name) {
      case 'CSS2Properties':
        Object.values(cssStyleRules[0].style).forEach(prop => {
          styles[toCamelCase(prop)] = cssStyleRules[0].style[prop]
        })
        break
      case 'CSSStyleDeclaration':
        styles = cssStyleRules[0].style
        break
      default:
        console.error('Unknown style object prototype')
        break
    }
  }
  return styles
}

/**
 * Filters out Background Rules for a given class Name.
 *
 * @param className   string    The class to filter rules from
 * @return {{}}
 */
export const getBackgroundStylesForSingleClass = className => {
  const style = getStyle(`.${className}`)
  const cssStyleRules = rulesForCssText(style)

  if (
    cssStyleRules.length > 0 &&
    typeof cssStyleRules[0].style !== 'undefined'
  ) {
    // Filter out background(-*) rules that contain a definition.
    return Object.keys(getStyleRules(cssStyleRules))
      .filter(
        key =>
          key.indexOf('background') === 0 && cssStyleRules[0].style[key] !== ''
      )
      .reduce((newData, key) => {
        newData[key] = cssStyleRules[0].style[key]
        return newData
      }, {})
  }
  return {}
}

/**
 * Uses the above to get all background(-*) rules from given class(es).
 *
 * @param className   string|array    className or array of classNames
 * @return {*}
 */
const getBackgroundStyles = className => {
  if (
    typeof window !== 'undefined' &&
    className !== null &&
    (className instanceof Object ||
      className instanceof String ||
      typeof className === 'string') &&
    !(className instanceof Array)
  ) {
    if (className.includes(' ')) {
      const classes = className.split(' ')
      let classObjects = []
      classes.forEach(item =>
        classObjects.push(getBackgroundStylesForSingleClass(item))
      )
      return Object.assign(...classObjects)
    }
    return getBackgroundStylesForSingleClass(className)
  }
  return {}
}

export default getBackgroundStyles
