let io
const listeners = []

export const callbackIO = entries => {
  entries.forEach(entry => {
    listeners.forEach(l => {
      if (l[0] === entry.target) {
        // Edge doesn't currently support isIntersecting, so also test for an intersectionRatio > 0
        if (entry.isIntersecting || entry.intersectionRatio > 0) {
          io.unobserve(l[0])
          l[1]()
        }
      }
    })
  })
}

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

export const listenToIntersections = (el, cb) => {
  getIO().observe(el)
  listeners.push([el, cb])
}
