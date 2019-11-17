import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import './mocks/IntersectionObserver.mock'
import { mockAllIsIntersecting } from './mocks/IntersectionObserver.mock'

import {
  fixedShapeMock,
  fluidShapeMock,
  setupBackgroundImage,
} from './mocks/Various.mock'
import BackgroundImage from '../'
import { activateCacheForImage, resetImageCache } from '../lib/ImageCache'
import { resetComponentClassCache } from '../lib/ClassCache'
import { createPictureRef } from '../lib/ImageRef'

const LOAD_FAILURE_SRC = 'test_fluid_image.jpg'
const LOAD_SUCCESS_SRC = 'test_fixed_image.jpg'

jest.mock('short-uuid')

describe(`<BackgroundImage /> with mock IO`, () => {
  const tmpImagePrototype = Object.getPrototypeOf(HTMLImageElement)

  beforeEach(() => {
    // Freeze StyleUtils#fixClassName.
    const uuid = require('short-uuid')
    uuid.generate.mockImplementation(() => '73WakrfVbNJBaAmhQtEeDv')

    // Mocking HTMLImageElement.prototype.src to call the onload or onerror
    // callbacks depending on the src passed to it
    Object.defineProperty(HTMLImageElement.prototype, 'src', {
      // Define the property setter
      set(src) {
        this.setAttribute('src', src)
        if (src === LOAD_FAILURE_SRC) {
          // Call with setTimeout to simulate async loading
          if (typeof this.onerror === `function`) {
            setTimeout(() => this.onerror(new Error('mocked error')))
          }
        } else if (src === LOAD_SUCCESS_SRC) {
          setTimeout(() => this.onload())
        }
      },
    })
    Object.defineProperty(HTMLImageElement.prototype, 'complete', {
      // Define the property setter
      set(complete) {
        this.complete = complete
      },
      get() {
        if (this.getAttribute('src') === LOAD_SUCCESS_SRC) {
          return true
        }
      },
    })
    Object.defineProperty(HTMLImageElement.prototype, 'naturalWidth', {
      // Define the property setter
      set(naturalWidth) {
        this.naturalWidth = naturalWidth
      },
      get() {
        if (this.getAttribute('src') === LOAD_SUCCESS_SRC) {
          return 1
        }
      },
    })
    Object.defineProperty(HTMLImageElement.prototype, 'naturalHeight', {
      // Define the property setter
      set(naturalHeight) {
        this.naturalHeight = naturalHeight
      },
      get() {
        if (this.getAttribute('src') === LOAD_SUCCESS_SRC) {
          return 1
        }
      },
    })

    resetImageCache()
  })
  afterEach(() => {
    Object.setPrototypeOf(HTMLImageElement, tmpImagePrototype)
    resetComponentClassCache()
  })

  it(`should render visible fluid image`, () => {
    // Mock Math.random beforehand, lest another random classname is created.
    Math.random = jest.fn(() => 0.424303425546642)
    let { container, rerender } = render(
      <BackgroundImage fluid={fluidShapeMock} />
    )
    mockAllIsIntersecting(true)
    expect(container).toMatchSnapshot()
    container = rerender(
      <BackgroundImage fluid={fluidShapeMock} />
    )
    expect(container).toMatchSnapshot()
  })

  it(`should render visible fixed image and call onLoadFunction`, () => {
    // Mock Math.random beforehand, lest another random classname is created.
    Math.random = jest.fn(() => 0.424303425546642)
    // Mock onStartLoad().
    const onLoadFunctionMock = jest.fn()
    let { container, rerender } = render(
      <BackgroundImage
        fluid={{ src: ``, aspectRatio: 1, srcSet: ``, sizes: `` }}
        onStartLoad={onLoadFunctionMock}
      />
    )
    mockAllIsIntersecting(true)
    expect(container).toMatchSnapshot()
    expect(onLoadFunctionMock).toHaveBeenCalled()
    container = rerender(<BackgroundImage fixed={fixedShapeMock} />)
    expect(container).toMatchSnapshot()
  })

  it(`should call critical fixed images`, () => {
    activateCacheForImage({ fixed: fixedShapeMock })
    const options = {
      addClass: true,
      critical: true,
      fixed: true,
    }
    const component = setupBackgroundImage(options)
    mockAllIsIntersecting(true)
    expect(component).toMatchSnapshot()
  })

  it(`should call stacked critical fixed images`, () => {
    activateCacheForImage({ fixed: [fixedShapeMock, fixedShapeMock] })
    const options = {
      addClass: true,
      critical: true,
      fixed: true,
      multiImage: true,
    }
    const component = setupBackgroundImage(options)
    mockAllIsIntersecting(true)
    expect(component).toMatchSnapshot()
  })

  it(`should call stacked critical fluid images`, () => {
    activateCacheForImage({ fluid: [fluidShapeMock, fluidShapeMock] })
    const options = {
      addClass: true,
      critical: true,
      fixed: false,
      fluid: true,
      multiImage: true,
    }
    const component = setupBackgroundImage(options)
    mockAllIsIntersecting(true)
    expect(component).toMatchSnapshot()
  })

  it(`should not call onLoad without prop, fadeIn should stay falsy without seenBefore`, () => {
    const options = {
      addClass: true,
      critical: true,
      fixed: true,
      onLoad: null,
    }
    const component = setupBackgroundImage(options)
    mockAllIsIntersecting(true)
    expect(component).toMatchSnapshot()
  })

  it(`should call onLoad and onError image events for LOAD_SUCCESS_SRC`, () => {
    const onLoadMock = jest.fn()
    const onErrorMock = jest.fn()
    const image = createPictureRef(
      {
        fixed: {
          src: LOAD_SUCCESS_SRC,
        },
        onLoad: onLoadMock,
        onError: onErrorMock,
      },
      onLoadMock
    )
    fireEvent.load(image)
    fireEvent.error(image)

    expect(onLoadMock).toHaveBeenCalledTimes(2)
    expect(onErrorMock).toHaveBeenCalledTimes(1)
  })

  it(`shouldn't call onLoad and onError image events without src`, () => {
    const onLoadMock = jest.fn()
    const onErrorMock = jest.fn()
    const image = createPictureRef(
      {
        fluid: {
          src: ``,
        },
        onLoad: onLoadMock,
        onError: onErrorMock,
      },
      onLoadMock
    )
    fireEvent.load(image)
    fireEvent.error(image)

    expect(onLoadMock).toHaveBeenCalledTimes(2)
    expect(onErrorMock).toHaveBeenCalledTimes(1)
  })
})

describe(`<BackgroundImage /> without IO`, () => {
  const tmpIO = global.IntersectionObserver
  beforeEach(() => {
    delete global.IntersectionObserver
    resetImageCache()
  })
  afterEach(() => {
    global.IntersectionObserver = tmpIO
  })

  it(`should call onLoadFunction without IO`, () => {
    const onLoadFunctionMock = jest.fn()
    activateCacheForImage({ fluid: fluidShapeMock })
    const options = {
      fluid: true,
      addClass: true,
      additionalClass: `test`,
      critical: true,
      onStartLoad: onLoadFunctionMock,
      fixed: false,
    }
    const component = setupBackgroundImage(options)
    expect(component).toMatchSnapshot()
    expect(onLoadFunctionMock).toHaveBeenCalled()
  })
})
