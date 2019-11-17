import { initialBgImage, switchImageSettings } from '../lib/ImageHandling'
import {
  fixedShapeMock,
  fluidArrayMock, fluidMock,
  fluidShapeMock,
} from './mocks/Various.mock'

describe(`switchImageSettings()`, () => {
  const mockImageRef = {
    src: `http://test.jpg`,
    currentSrc: `http://test.webp`,
    complete: true,
  }
  const state = {
    isVisible: false,
    isLoaded: false,
    imageState: 1,
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

  it(`should return settings from fixed array`, () => {
    state.isVisible = true
    state.imgLoaded = true
    const createdSettings = switchImageSettings({
      image: fluidArrayMock.fluid,
      bgImage: [`string_of_base64`, `imageString`],
      imageRef: [mockImageRef, mockImageRef],
      state,
    })
    expect(createdSettings).toMatchSnapshot()
  })

  it(`should return settings from fixed array without currentSrc`, () => {
    const mockImageRefNoCurrentSrc = [{ ...mockImageRef }, { ...mockImageRef }]
    delete mockImageRefNoCurrentSrc[0].currentSrc
    delete mockImageRefNoCurrentSrc[1].currentSrc
    state.isVisible = true
    state.imgLoaded = true
    const createdSettings = switchImageSettings({
      image: fluidArrayMock.fluid,
      imageRef: mockImageRefNoCurrentSrc,
      bgImage: [``, ``],
      state,
    })
    expect(createdSettings).toMatchSnapshot()
  })

  it(`should return settings from fluid without src`, () => {
    const fluid = fluidShapeMock
    delete fluid.src
    const mockImageRefNoSrc = { ...mockImageRef }
    delete mockImageRefNoSrc.src
    state.isVisible = true
    state.imgLoaded = true
    const createdSettings = switchImageSettings({
      image: fluid,
      bgImage: ``,
      imageRef: mockImageRefNoSrc,
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

describe(`initialBgImage()`, () => {
  it(`should return initial array without dummies`, () => {
    const initialWithoutDummies = initialBgImage(fluidArrayMock, false)
    expect(initialWithoutDummies).toMatchSnapshot()
  })

  it(`should return initial single tracedSVG`, () => {
    fluidMock.fluid.tracedSVG = `data:image/svg+xml,...`
    const initialTracedSVG = initialBgImage(fluidMock)
    expect(initialTracedSVG).toMatchSnapshot()
  })
})
