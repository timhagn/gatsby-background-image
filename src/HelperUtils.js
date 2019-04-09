/**
 * Handle legacy names for image queries.
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
 * Converts CSS kebab-case strings to camel-cased js style rules.
 *
 * @param str   string    Rule to transform
 * @return {boolean|string}
 */
export const toCamelCase = str =>
  typeof str === 'string' &&
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
  typeof str === 'string' &&
  str
    .replace(/\s|\W+/g, '')
    .replace(/[A-Z]/g, match => '-' + match.toLowerCase())
