import '@babel/polyfill'
import React from 'react'
import 'react-testing-library/cleanup-after-each'
import * as IOUtils from '../IntersectionObserverUtils'

global.console.debug = jest.fn()

let elements = []

describe(`IntersectionObserverUtils without IO`, () => {
  const tmpGetIO = IOUtils.getIO()
  const tmpWindow = global.window
  const tmpIO = global.IntersectionObserver
  beforeEach(() => {
    delete global.IntersectionObserver
    delete global.window
    IOUtils.getIO = jest.fn(() => undefined)
  })
  afterEach(() => {
    IOUtils.getIO = tmpGetIO
    global.window = tmpWindow
    global.IntersectionObserver = tmpIO
  })

  it(`should not call IntersectionObserver`, () => {
    elements = []
    const tmpImageRef = { mock: true, target: 'test' }
    const emptyFunction = IOUtils.listenToIntersections(
      tmpImageRef,
      IOUtils.callbackIO(elements)
    )
    expect(typeof emptyFunction).toEqual(`function`);
    expect(emptyFunction()).toBeUndefined()
  })
})

describe(`IntersectionObserverUtils`, () => {
  const observe = jest.fn(callback => elements.push(callback))
  const unobserve = jest.fn(callback => elements.unshift(callback))
  beforeEach(() => {
    global.IntersectionObserver = jest.fn(() => ({
      observe,
      unobserve,
    }))
  })

  it(`should call IntersectionObserver`, () => {
    const tmpImageRef = { mock: true }
    elements.push(tmpImageRef)
    const returnedFunc = IOUtils.listenToIntersections(
      tmpImageRef,
      IOUtils.callbackIO(elements)
    )
    expect(observe).toHaveBeenCalled()
    returnedFunc()
    expect(unobserve).toHaveBeenCalled()
  })

  it(`callback should work with mock isIntersecting`, () => {
    const tmpImageRef = { mock: true }
    const mockCallback = jest.fn()
    IOUtils.listenToIntersections(tmpImageRef, mockCallback)
    const mockEntries = [
      {
        target: tmpImageRef,
        isIntersecting: true,
      },
    ]
    IOUtils.callbackIO(mockEntries)
    expect(mockCallback).toHaveBeenCalled()
  })

  it(`callback should work without both`, () => {
    const tmpImageRef = { mock: true }
    const mockCallback = jest.fn()
    IOUtils.listenToIntersections(tmpImageRef, mockCallback)
    const mockEntries = [
      {
        target: tmpImageRef,
        isIntersecting: false,
        intersectionRatio: 0,
      },
    ]
    IOUtils.callbackIO(mockEntries)
    expect(mockCallback).toHaveBeenCalledTimes(0)
  })
})
