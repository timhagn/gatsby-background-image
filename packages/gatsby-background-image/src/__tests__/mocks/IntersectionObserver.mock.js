/**
 * Taken from https://github.com/thebuilder/react-intersection-observer/
 * (file `src/test-utils.ts`)
 *
 * Kudos to @thebuilder for figuring this out!
 */
import { act } from 'react-dom/test-utils'

const observerMap = new Map()
const instanceMap = new Map()

beforeAll(() => {
  global.IntersectionObserver = jest.fn((cb, options) => {
    const instance = {
      thresholds: Array.isArray(options.threshold)
        ? options.threshold
        : [options.threshold],
      root: options.root,
      rootMargin: options.rootMargin,
      observe: jest.fn(element => {
        instanceMap.set(element, instance)
        observerMap.set(element, cb)
      }),
      unobserve: jest.fn(element => {
        instanceMap.delete(element)
        observerMap.delete(element)
      }),
      disconnect: jest.fn(),
    }
    return instance
  })
})

afterEach(() => {
  global.IntersectionObserver.mockClear()
  instanceMap.clear()
  observerMap.clear()
})

/**
 * Set the `isIntersecting` on all current IntersectionObserver instances
 * @param isIntersecting {boolean}
 */
export function mockAllIsIntersecting(isIntersecting) {
  observerMap.forEach((onChange, element) => {
    mockIsIntersecting(element, isIntersecting)
  })
}

/**
 * Set the `isIntersecting` for the IntersectionObserver of a specific element.
 * @param element {Element}
 * @param isIntersecting {boolean}
 */
export function mockIsIntersecting(element, isIntersecting) {
  const cb = observerMap.get(element)
  if (cb) {
    const entry = [
      {
        isIntersecting,
        target: element,
        intersectionRatio: isIntersecting ? 1 : 0,
      },
    ]
    if (act) act(() => cb(entry))
    else cb(entry)
  } else {
    throw new Error(
      'No IntersectionObserver instance found for element. Is it still mounted in the DOM?'
    )
  }
}

/**
 * Call the `intersectionMockInstance` method with an element, to get the (mocked)
 * `IntersectionObserver` instance. You can use this to spy on the `observe` and
 * `unobserve` methods.
 * @param element {Element}
 * @return IntersectionObserver
 */
export function intersectionMockInstance(element) {
  return instanceMap.get(element)
}
