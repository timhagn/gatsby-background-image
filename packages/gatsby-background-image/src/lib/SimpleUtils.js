/**
 * Are we in the browser?
 *
 * @return {boolean}
 */
export const isBrowser = () =>
  typeof window !== `undefined` && typeof window.document !== `undefined`;

/**
 * Tests a given value on being a string.
 *
 * @param value *   Value to test
 * @return {boolean}
 */
export const isString = value =>
  Object.prototype.toString.call(value) === '[object String]';

/**
 * Tests a given value on being a string.
 *
 * @param value *   Value to test
 * @return {boolean}
 */
export const isObject = value =>
  Object.prototype.toString.call(value) === '[object Object]';

/**
 * Converts CSS kebab-case strings to camel-cased js style rules.
 *
 * @param str   string    Rule to transform
 * @return {boolean|string}
 */
export const toCamelCase = str =>
  (isString(str) &&
    str.indexOf('-') !== -1 &&
    str
      .toLowerCase()
      .replace(/(?:^\w|-|[A-Z]|\b\w)/g, (letter, index) =>
        index === 0 ? letter.toLowerCase() : letter.toUpperCase()
      )
      .replace(/\s|\W+/g, '')) ||
  str;

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
    .replace(/[A-Z]/g, match => `-${match.toLowerCase()}`);

/**
 * Splits a given string (e.g. from classname) to an array.
 *
 * @param str string|array  String to split or return as array
 * @param delimiter string  Delimiter on which to split str
 * @return {array|boolean}  Returns (split) string as array, false on failure
 */
export const stringToArray = (str, delimiter = ` `) => {
  if (str instanceof Array) {
    return str;
  }
  if (isString(str)) {
    if (str.includes(delimiter)) {
      return str.split(delimiter);
    }
    return [str];
  }
  return false;
};

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
      hash = (hash << 5) - hash + item.charCodeAt(0);
      return hash | 0;
    },
    0
  );

/**
 * As the name says, it filters out empty strings from an array and joins it.
 *
 * @param arrayToJoin   array   Array to join after filtering.
 * @return {string}
 */
export const filteredJoin = arrayToJoin =>
  arrayToJoin.filter(item => item !== ``).join();

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
    return [fromArray];
  }
  return fromArray.map((item, index) => item || (toArray && toArray[index]));
};
