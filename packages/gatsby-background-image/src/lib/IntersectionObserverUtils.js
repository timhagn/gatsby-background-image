/* eslint-disable no-unused-expressions */
import { isBrowser } from './SimpleUtils';

let io;
const listeners = new WeakMap();

const connection =
  typeof navigator !== `undefined`
    ? navigator?.connection ||
      navigator?.mozConnection ||
      navigator?.webkitConnection
    : {};

// These match the thresholds used in Chrome's native lazy loading
const FAST_CONNECTION_THRESHOLD = `1250px`;
const SLOW_CONNECTION_THRESHOLD = `2500px`;

/**
 * Executes each IntersectionObserver entries' callback.
 *
 * @param entries
 */
export const callbackIO = entries => {
  entries.forEach(entry => {
    if (listeners.has(entry.target)) {
      const callback = listeners.get(entry.target);
      // Edge doesn't currently support isIntersecting, so also test for an intersectionRatio > 0
      if (entry.isIntersecting || entry.intersectionRatio > 0) {
        io.unobserve(entry.target);
        listeners.delete(entry.target);
        callback();
      }
    }
  });
};

/**
 * Returns an IntersectionObserver instance if exists.
 *
 * @param rootMargin    string    The current rootMargin.
 * @return {IntersectionObserver|undefined}
 */
export const getIO = rootMargin => {
  if (typeof io === `undefined` && isBrowser() && window.IntersectionObserver) {
    io = new window.IntersectionObserver(callbackIO, {
      rootMargin,
    });
  }

  return io;
};

/**
 * Registers IntersectionObserver callback on element.
 *
 * @param element     Element   The element to observe.
 * @param callback    function  Callback to call when intersecting.
 * @param rootMargin  string    The current rootMargin.
 * @return {Function}
 */
export const listenToIntersections = (element, callback, rootMargin) => {
  const connectionType = connection?.effectiveType;
  const currentRootMargin =
    rootMargin || connectionType === `4g`
      ? FAST_CONNECTION_THRESHOLD
      : SLOW_CONNECTION_THRESHOLD;
  const observer = getIO(currentRootMargin);

  if (observer) {
    observer.observe(element);
    listeners.set(element, callback);
    return () => {
      observer.unobserve(element);
      listeners.delete(element);
    };
  }
  return () => {};
};
