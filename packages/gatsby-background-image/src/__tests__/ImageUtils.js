import '@babel/polyfill'
import { render, cleanup } from 'react-testing-library'
import React from 'react'
import { fixedShapeMock, fluidShapeMock } from './index'
import {
  noscriptImg,
  inImageCache,
  activateCacheForImage,
  createPictureRef,
  switchImageSettings,
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


describe(`switchImageSettings()`, () => {
  const mockImageRef = {
    src: `test.jpg`,
    currentSrc: `test.webp`,
  }
  it(`should return settings from fluid with empty bgImage`, () => {
    const createdSettings = switchImageSettings({
      image: fluidShapeMock,
      bgImage: ``,
      mockImageRef,
      isVisible: false,
      fadeIn: true,
    })
    expect(createdSettings).toEqual({
      "afterOpacity": 1,
      "bgImage": "string_of_base64",
      "nextImage": "string_of_base64",
      "noBase64": true
    })
  })

  it(`should return settings from fixed with set bgImage`, () => {
    const createdSettings = switchImageSettings({
      image: fixedShapeMock,
      bgImage: `string_of_base64`,
      mockImageRef,
      isVisible: false,
      fadeIn: true,
    })
    expect(createdSettings).toEqual({
      "afterOpacity": 1,
      "bgImage": "string_of_base64",
      "nextImage": "string_of_base64",
      "noBase64": true
    })
  })

  it(`should return settings from fixed with set bgImage`, () => {
    const createdSettings = switchImageSettings({
      image: fluidShapeMock,
      bgImage: `string_of_base64`,
      mockImageRef,
      isVisible: false,
      fadeIn: true,
    })
    expect(createdSettings).toEqual({
      "afterOpacity": 1,
      "bgImage": "string_of_base64",
      "nextImage": "string_of_base64",
      "noBase64": true
    })
  })

  it(`should return settings from fluid with set bgImage without base64`, () => {
    const fluid = fluidShapeMock
    delete fluid.base64
    const createdSettings = switchImageSettings({
      image: fluid,
      bgImage: `string_of_base64`,
      mockImageRef,
      isVisible: false,
      fadeIn: true,
    })
    expect(createdSettings).toEqual({
      "afterOpacity": 1,
      "bgImage": "string_of_base64",
      "nextImage": "",
      "noBase64": false
    })
  })

  it(`should return settings from fluid with set bgImage and tracedSVG`, () => {
    const fluid = {
      ...fluidShapeMock,
      tracedSVG: 'test_tracedSVG.svg',
    }
    delete fluid.base64
    const createdSettings = switchImageSettings({
      image: fluid,
      bgImage: `test_tracedSVG.svg`,
      mockImageRef,
      isVisible: false,
      fadeIn: false,
    })
    expect(createdSettings).toEqual({
      "afterOpacity": 1,
      "bgImage": "test_tracedSVG.svg",
      "nextImage": "\"test_tracedSVG.svg\"",
      "noBase64": false
    })
  })

  it(`should return settings from fluid with set bgImage and base64`, () => {
    const mockRef = mockImageRef
    delete mockRef.src
    const createdSettings = switchImageSettings({
      image: fluidShapeMock,
      bgImage: `string_of_base64`,
      mockRef,
      isVisible: true,
      fadeIn: true,
    })
    expect(createdSettings).toEqual({
      "afterOpacity": 1,
      "bgImage": "string_of_base64",
      "nextImage": "test_fluid_image.jpg",
      "noBase64": false
    })
  })
})