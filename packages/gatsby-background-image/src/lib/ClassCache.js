const componentClassCache = Object.create({});
/**
 * Cache component classes as we never know if a Component wasn't already set.
 *
 * @param className   string  className given by props
 * @return {*|boolean}
 */
export const inComponentClassCache = className => {
  return componentClassCache[className] || false;
};

/**
 * Adds a component's classes to componentClassCache.
 *
 * @param className   string  className given by props
 */
export const activateCacheForComponentClass = className => {
  if (className) {
    componentClassCache[className] = true;
  }
};

/**
 * Resets the componentClassCache (especially important for reliable tests).
 */
export const resetComponentClassCache = () => {
  for (const className in componentClassCache)
    delete componentClassCache[className];
};
