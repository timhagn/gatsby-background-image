import '@babel/polyfill'
import { render, cleanup } from 'react-testing-library'
import React from 'react'
import { fixedShapeMock, fluidShapeMock } from './index'
import {
  noscriptImg,
  inImageCache,
  activateCacheForImage,
  createPictureRef
} from '../ImageUtils'


global.console.debug = jest.fn()


afterAll(cleanup)


const fixedMock = {
  fixed: fixedShapeMock,
}

const fluidMock = {
  fluid: fluidShapeMock,
}


describe(`createImageToLoad()`, () => {
  it(`should return null on ssr or empty fluid / fixed prop`, () => {
    const emptyImageRef = createPictureRef({})
    expect(emptyImageRef).toBeNull()
  })
})


describe(`inImageCache() / activateCacheForImage()`, () => {
  it(`inImageCache() should return false for initial load (fixed)`, () => {
    const inCache = inImageCache(fixedMock)
    expect(inCache).toBeFalsy()
  })

  it(`should return img from cache after activateCacheForImage() (fixed)`, () => {
    activateCacheForImage(fixedMock)
    const inCache = inImageCache(fixedMock)
    expect(inCache).toBeTruthy()
  })

  it(`inImageCache() should return false for initial load (fluid)`, () => {
    const inCache = inImageCache(fluidMock)
    expect(inCache).toBeFalsy()
  })

  it(`should return img from cache after activateCacheForImage() (fluid)`, () => {
    activateCacheForImage(fluidMock)
    const inCache = inImageCache(fluidMock)
    expect(inCache).toBeTruthy()
  })
})


describe(`noscriptImg()`, () => {
  it(`should return default noscriptImg on {}`, () => {
    const { container } = render(noscriptImg({}))
    expect(container).toMatchSnapshot()
  })

  it(`should return noscriptImg with opacity & transitionDelay`, () => {
    const dummyProps = {
      opacity: .99,
      transitionDelay: 100,
    }
    const { container } = render(noscriptImg(dummyProps))
    expect(container).toMatchSnapshot()
  })
})