import BackgroundImage from './index'

/**
 * Handle legacy names for image queries
 *
 * @param props
 * @return {Object}
 */
export const convertProps = props => {
  let convertedProps = { ...props }
  if (convertedProps.resolutions) {
    convertedProps.fixed = convertedProps.resolutions
    delete convertedProps.resolutions
  }
  if (convertedProps.sizes) {
    convertedProps.fluid = convertedProps.sizes
    delete convertedProps.sizes
  }

  return convertedProps
}

/**
 * Strip BackgroundImage propTypes from remaining props to be passed to <Tag />
 *
 * @param props
 * @return {Object}
 */
export const stripRemainingProps = props => {
  let remainingProps = { ...props }

  Object.keys(BackgroundImage.propTypes).forEach(propTypesKey => {
    if (remainingProps.hasOwnProperty(propTypesKey)) {
      delete remainingProps[propTypesKey]
    }
  })

  return remainingProps
}

/**
 * Converts CSS kebab-case strings to camel-cased js style rules.
 *
 * @param str   string    Rule to transform
 * @return {boolean|string}
 */
export const toCamelCase = str =>
  isString(str) &&
  str
    .toLowerCase()
    .replace(/(?:^\w|-|[A-Z]|\b\w)/g, (letter, index) =>
      index === 0 ? letter.toLowerCase() : letter.toUpperCase()
    )
    .replace(/\s|\W+/g, '')

/**
 * Converts camel-cased js style rules to CSS kebab-case strings.
 *
 * @param str string    Rule to transform
 * @return {boolean|string}
 */
export const toKebabCase = str =>
  isString(str) &&
  str
    .replace(/\s|\W+/g, '')
    .replace(/[A-Z]/g, match => '-' + match.toLowerCase())

/**
 * Splits a given string (e.g. from classname) to an array.
 *
 * @param str string|array  String to split or return as array
 * @param delimiter string  Delimiter on which to split str
 * @return {array|boolean}  Returns (split) string as array, false on failure
 */
export const stringToArray = (str, delimiter = ` `) => {
  if (str instanceof Array) {
    return str
  } else if (isString(str)) {
    if (str.includes(delimiter)) {
      return str.split(delimiter)
    } else {
      return [str]
    }
  } else {
    return false
  }
}

/**
 * Tests a given value on being a string.
 *
 * @param value *   Value to test
 * @return {boolean}
 */
export const isString = value =>
  Object.prototype.toString.call(value) === '[object String]'
