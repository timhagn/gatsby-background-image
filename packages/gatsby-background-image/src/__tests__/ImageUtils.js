import { render } from 'react-testing-library'
import 'react-testing-library/cleanup-after-each'
import React from 'react'
import { fixedShapeMock, fluidShapeMock } from './mocks/Various.mock'
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

describe(`createImageToLoad() with crossOrigin`, () => {
  it(`should set crossOrigin`, () => {
    const emptyImageRef = createPictureRef({
      fluid: fluidShapeMock,
      crossOrigin: `anonymous`,
    })
    expect(emptyImageRef).toMatchInlineSnapshot(`
      <img
        crossorigin="anonymous"
        src="test_fluid_image.jpg"
        srcset="some srcSet"
      />
    `)
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

  it(`should return noscriptImg with opacity & transitionDelay & crossOrigin`, () => {
    const dummyProps = {
      opacity: 0.99,
      transitionDelay: 100,
      crossOrigin: `anonymous`
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
  const state = {
    isVisible: false,
    isLoaded: false,
  }
  it(`should return settings from fluid with empty bgImage`, () => {
    const createdSettings = switchImageSettings({
      image: fluidShapeMock,
      bgImage: ``,
      imageRef: mockImageRef,
      state,
    })
    expect(createdSettings).toMatchSnapshot()
  })

  it(`should return settings from fixed with set bgImage`, () => {
    const createdSettings = switchImageSettings({
      image: fixedShapeMock,
      bgImage: `string_of_base64`,
      imageRef: mockImageRef,
      state,
    })
    expect(createdSettings).toMatchSnapshot()
    expect(createdSettings.lastImage).toEqual(`string_of_base64`)
  })

  it(`should return settings from fixed with set bgImage`, () => {
    const createdSettings = switchImageSettings({
      image: fluidShapeMock,
      bgImage: `string_of_base64`,
      imageRef: mockImageRef,
      state,
    })
    expect(createdSettings).toMatchSnapshot()
  })

  it(`should return settings from fluid with set bgImage without base64`, () => {
    const fluid = fluidShapeMock
    delete fluid.base64
    const createdSettings = switchImageSettings({
      image: fluid,
      bgImage: ``,
      imageRef: mockImageRef,
      state,
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
      imageRef: mockImageRef,
      state,
    })
    expect(createdSettings).toMatchSnapshot()
  })

  it(`should return settings from fluid with set bgImage and base64`, () => {
    const mockRef = mockImageRef
    delete mockRef.src
    state.isVisible = true
    state.isLoaded = true
    const createdSettings = switchImageSettings({
      image: fluidShapeMock,
      bgImage: `string_of_base64`,
      imageRef: mockRef,
      state,
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
