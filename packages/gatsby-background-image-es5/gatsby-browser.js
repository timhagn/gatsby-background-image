'use strict';

exports.onClientEntry = function {
  // IntersectionObserver polyfill for gatsby-background-image-es5 (Safari, IE)
  if (typeof window.IntersectionObserver === `undefined`) {
    import(`intersection-observer`)
    console.log(`# IntersectionObserver is polyfilled!`)
  }
}