let io
const listeners = new WeakMap()

/**
 * Executes each IntersectionObserver entries' callback.
 *
 * @param entries
 */
export const callbackIO = entries => {
  entries.forEach(entry => {
    if (listeners.has(entry.target)) {
      const callback = listeners.get(entry.target)
      // Edge doesn't currently support isIntersecting, so also test for an intersectionRatio > 0
      if (entry.isIntersecting || entry.intersectionRatio > 0) {
        io.unobserve(entry.target)
        listeners.delete(entry.target)
        callback()
      }
    }
  })
}

/**
 * Returns an IntersectionObserver instance if exists.
 *
 * @return {IntersectionObserver|undefined}
 */
export const getIO = () => {
  if (
    typeof io === `undefined` &&
    typeof window !== `undefined` &&
    window.IntersectionObserver
  ) {
    io = new window.IntersectionObserver(callbackIO, { rootMargin: `200px` })
  }

  return io
}

/**
 * Registers IntersectionObserver callback on element.
 *
 * @param element
 * @param callback
 * @return {Function}
 */
export const listenToIntersections = (element, callback) => {
  const observer = getIO()

  if (observer) {
    observer.observe(element)
    listeners.set(element, callback)
    return () => {
      observer.unobserve(element)
      listeners.delete(element)
    }
  }
  return () => {}
}
