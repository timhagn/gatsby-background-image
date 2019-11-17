import filterInvalidDOMProps from 'filter-invalid-dom-props'
import {
  groupByMedia,
  hasArtDirectionFixedArray,
  hasArtDirectionFluidArray,
} from './MediaUtils'

/**
 * Are we in the browser?
 *
 * @return {boolean}
 */
export const isBrowser = () => typeof window !== 'undefined'

/**
 * Tests a given value on being a string.
 *
 * @param value *   Value to test
 * @return {boolean}
 */
export const isString = value =>
  Object.prototype.toString.call(value) === '[object String]'

/**
 * Strip BackgroundImage propTypes from remaining props to be passed to <Tag />
 *
 * @param props
 * @return {Object}
 */
export const stripRemainingProps = props => filterInvalidDOMProps(props)

/**
 * Handle legacy names for image queries
 *
 * @param props
 * @return {Object}
 */
export const convertProps = props => {
  const convertedProps = { ...props }
  const { resolutions, sizes, classId, fixed, fluid } = convertedProps

  if (resolutions) {
    convertedProps.fixed = resolutions
    delete convertedProps.resolutions
  }
  if (sizes) {
    convertedProps.fluid = sizes
    delete convertedProps.sizes
  }

  if (classId) {
    logDeprecationNotice(
      `classId`,
      `gatsby-background-image should provide unique classes automatically. Open an Issue should you still need this property.`
    )
  }

  // if (fluid && !hasImageArray(props)) {
  //   convertedProps.fluid = [].concat(fluid)
  // }
  //
  // if (fixed && !hasImageArray(props)) {
  //   convertedProps.fixed = [].concat(fixed)
  // }

  // convert fluid & fixed to arrays so we only have to work with arrays
  if (fluid && hasArtDirectionFluidArray(props)) {
    convertedProps.fluid = groupByMedia(convertedProps.fluid)
  }
  if (fixed && hasArtDirectionFixedArray(props)) {
    convertedProps.fixed = groupByMedia(convertedProps.fixed)
  }

  return convertedProps
}

/**
 * Checks if fluid or fixed are image arrays.
 *
 * @param props   object   The props to check for images.
 * @return {boolean}
 */
export const hasImageArray = props =>
  (props.fluid && Array.isArray(props.fluid)) ||
  (props.fixed && Array.isArray(props.fixed))

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
    .replace(/[A-Z]/g, match => `-${match.toLowerCase()}`)

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
  }
  if (isString(str)) {
    if (str.includes(delimiter)) {
      return str.split(delimiter)
    }
    return [str]
  }
  return false
}

/**
 * Hashes a String to a 32bit integer with the simple Java 8 hashCode() func.
 *
 * @param str   string    String to hash.
 * @return {number}
 */
export const hashString = str =>
  isString(str) &&
  [].reduce.call(
    str,
    (hash, item) => {
      hash = (hash << 5) - hash + item.charCodeAt(0)
      return hash | 0
    },
    0
  )

/**
 * As the name says, it filters out empty strings from an array and joins it.
 *
 * @param arrayToJoin   array   Array to join after filtering.
 * @return {string}
 */
export const filteredJoin = arrayToJoin =>
  arrayToJoin.filter(item => item !== ``).join()

/**
 * Combines two arrays while keeping fromArrays indexes & values.
 *
 * @param fromArray   array   Array the values shall be taken from.
 * @param toArray     array   Array to copy values into.
 * @return {array}
 */
export const combineArray = (fromArray, toArray) => {
  // Fallback for singular images.
  if (!Array.isArray(fromArray)) {
    return [fromArray]
  }
  return fromArray.map((item, index) => item || toArray[index])
}

/**
 * Logs a warning if deprecated props where used.
 *
 * @param prop
 * @param notice
 */
export const logDeprecationNotice = (prop, notice) => {
  if (process.env.NODE_ENV === `production`) {
    return
  }

  console.log(
    `
    The "${prop}" prop is now deprecated and will be removed in the next major version
    of "gatsby-background-image".
    `
  )

  if (notice) {
    console.log(notice)
  }
}
