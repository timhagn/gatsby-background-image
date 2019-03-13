import '@babel/polyfill'
import React from 'react'
import {
  callbackIO,
  listenToIntersections,
} from '../IntersectionObserverUtils'

global.console.debug = jest.fn()

let elements = []

describe(`IntersectionObserverUtils`, () => {
  beforeEach(() => {
    global.IntersectionObserver = jest.fn(() => ({
      observe: jest.fn(callback => elements.push(callback)),
      unobserve: jest.fn(callback => elements.unshift(callback))
    }))
  })

  it(`should call IntersectionObserver`, () => {
    const tmpImageRef = { mock: true }
    elements.push(tmpImageRef)
    listenToIntersections(tmpImageRef, callbackIO(elements))
  })

  it(`callback should work with mock isIntersecting`, () => {
    const tmpImageRef = { mock: true }
    const mockCallback = jest.fn()
    listenToIntersections(tmpImageRef, mockCallback)
    const mockEntries = [
      {
        target: tmpImageRef,
        isIntersecting: true,
      },
    ]
    callbackIO(mockEntries)
    expect(mockCallback).toHaveBeenCalled()
  })

  it(`callback should work with mock intersectionRatio`, () => {
    const tmpImageRef = { mock: true }
    const mockCallback = jest.fn()
    listenToIntersections(tmpImageRef, mockCallback)
    const mockEntries = [
      {
        target: tmpImageRef,
        intersectionRatio: 10,
      },
    ]
    callbackIO(mockEntries)
    expect(mockCallback).toHaveBeenCalled()
  })
})


describe(`IntersectionObserverUtils without IO`, () => {
  beforeEach(() => {
    delete global.IntersectionObserver
  })

  it(`should not call IntersectionObserver`, () => {
    const tmpImageRef = { mock: true, target: 'test' }
    listenToIntersections(tmpImageRef, callbackIO(elements))
  })
})