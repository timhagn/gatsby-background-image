import '@babel/polyfill'
import { render } from 'react-testing-library'
import 'react-testing-library/cleanup-after-each'
import React from 'react'
import { fixedShapeMock, fluidShapeMock } from './index'
import {
  noscriptImg,
  inImageCache,
  activateCacheForImage,
  resetImageCache,
  createPictureRef,
  switchImageSettings,
  imagePropsChanged,
} from '../ImageUtils'

global.console.debug = jest.fn()

afterEach(resetImageCache)

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

  it(`should return null on ssr or empty fluid / fixed prop & wrong type for onLoad`, () => {
    const emptyImageRef = createPictureRef({}, {})
    expect(emptyImageRef).toBeNull()
  })
})


describe(`inImageCache() / activateCacheForImage()`, () => {
  it(`should return false for initial load (fixed)`, () => {
    fixedMock.src = `test.jpg`
    const inCache = inImageCache(fixedMock)
    expect(inCache).toBeFalsy()
  })

  it(`shouldn't activate cache without fixed / fluid`, () => {
    activateCacheForImage()
    const inCache = inImageCache()
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

  it(`should return false without mock`, () => {
    const inCache = inImageCache()
    expect(inCache).toBeFalsy()
  })
})

describe(`inImageCache() / activateCacheForImage() / resetImageCache()`, () => {
  it(`should reset imageCache after caching`, () => {
    activateCacheForImage(fluidMock)
    resetImageCache()
    const inCache = inImageCache(fluidMock)
    expect(inCache).toBeFalsy()
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
    expect(createdSettings).toMatchSnapshot()
  })

  it(`should return settings from fixed with set bgImage`, () => {
    const createdSettings = switchImageSettings({
      image: fixedShapeMock,
      bgImage: `string_of_base64`,
      mockImageRef,
      isVisible: false,
      fadeIn: true,
    })
    expect(createdSettings).toMatchSnapshot()
    expect(createdSettings.lastImage).toEqual(`string_of_base64`)
  })

  it(`should return settings from fixed with set bgImage`, () => {
    const createdSettings = switchImageSettings({
      image: fluidShapeMock,
      bgImage: `string_of_base64`,
      mockImageRef,
      isVisible: false,
      fadeIn: true,
    })
    expect(createdSettings).toMatchSnapshot()
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
    expect(createdSettings).toMatchSnapshot()
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
    expect(createdSettings).toMatchSnapshot()
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
    expect(createdSettings).toMatchSnapshot()
  })
})


describe(`imagePropsChanged()`, () => {
  it(`should return false for same fixed prop`, () => {
    const changedFixed = imagePropsChanged(fixedMock, fixedMock)
    expect(changedFixed).toBeFalsy()
  })

  it(`should return false for same fluid prop`, () => {
    const changedFluid = imagePropsChanged(fluidMock, fluidMock)
    expect(changedFluid).toBeFalsy()
  })

  it(`should return true from fluid to fixed`, () => {
    const changedFluidToFixed = imagePropsChanged(fluidMock, fixedMock)
    expect(changedFluidToFixed).toBeTruthy()
  })

  it(`should return true from fixed to fluid`, () => {
    const changedFixedToFluid = imagePropsChanged(fixedMock, fluidMock)
    expect(changedFixedToFluid).toBeTruthy()
  })
})