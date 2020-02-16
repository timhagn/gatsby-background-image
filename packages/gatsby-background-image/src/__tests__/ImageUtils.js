import {
  fixedArrayMock,
  fixedMock,
  fixedShapeMock,
  fluidArrayMock,
  fluidMock,
  fluidShapeMock,
  mockArtDirectionStackFluid,
} from './mocks/Various.mock'
import {
  imagePropsChanged,
  getCurrentFromData,
  getUrlString,
  imageLoaded,
  getSelectedImage,
  getCurrentSrcData,
} from '../lib/ImageUtils'
import { resetImageCache } from '../lib/ImageCache'
import { activatePictureRef, imageReferenceCompleted } from '../lib/ImageRef'

global.console.debug = jest.fn()

afterEach(resetImageCache)

describe(`noscriptImg() / activatePictureRef() without HTMLPictureElement (IE11)`, () => {
  const tmpPicture = HTMLPictureElement
  const dummySelfRef = {
    offsetWidth: 500,
    offsetHeight: 500,
  }
  beforeEach(() => {
    delete global.HTMLPictureElement
  })
  afterEach(() => {
    global.HTMLPictureElement = tmpPicture
  })

  it(`activatePictureRef() should still create an imageRef with selfRef`, () => {
    const testImg = new Image()
    const dummyImageRef = activatePictureRef(
      testImg,
      {
        fluid: fluidShapeMock,
        critical: true,
      },
      dummySelfRef
    )
    expect(dummyImageRef).toMatchSnapshot()
  })

  it(`activatePictureRef() should still create an imageRef without selfRef`, () => {
    const testImg = new Image()
    const dummyImageRef = activatePictureRef(testImg, {
      fluid: fluidShapeMock,
      critical: true,
    })
    expect(dummyImageRef).toMatchSnapshot()
  })
})

describe(`imagePropsChanged()`, () => {
  it(`should return false for same fixed prop`, () => {
    const changedFixed = imagePropsChanged(fixedMock, fixedMock)
    expect(changedFixed).toBeFalsy()
  })

  it(`should return false for same fixed array prop`, () => {
    const changedFixed = imagePropsChanged(fixedArrayMock, fixedArrayMock)
    expect(changedFixed).toBeFalsy()
  })

  it(`should return false for same fluid prop`, () => {
    const changedFluid = imagePropsChanged(fluidMock, fluidMock)
    expect(changedFluid).toBeFalsy()
  })

  it(`should return false for same fluid array prop`, () => {
    const changedFluid = imagePropsChanged(fluidArrayMock, fluidArrayMock)
    expect(changedFluid).toBeFalsy()
  })

  it(`should return true from fluid to fixed`, () => {
    const changedFluidToFixed = imagePropsChanged(fluidMock, fixedMock)
    expect(changedFluidToFixed).toBeTruthy()
  })

  it(`should return true from fluid to fluid array`, () => {
    const changedFluidToFixed = imagePropsChanged(fluidMock, fluidArrayMock)
    expect(changedFluidToFixed).toBeTruthy()
  })

  it(`should return true from fluid array to fluid`, () => {
    const changedFluidToFixed = imagePropsChanged(fluidArrayMock, fluidMock)
    expect(changedFluidToFixed).toBeTruthy()
  })

  it(`should return true from fixed to fluid`, () => {
    const changedFixedToFluid = imagePropsChanged(fixedMock, fluidMock)
    expect(changedFixedToFluid).toBeTruthy()
  })

  it(`should return true from fixed to fixed array`, () => {
    const changedFixedToFluid = imagePropsChanged(fixedMock, fixedArrayMock)
    expect(changedFixedToFluid).toBeTruthy()
  })

  it(`should return true from fixed array to fixed`, () => {
    const changedFixedToFluid = imagePropsChanged(fixedArrayMock, fixedMock)
    expect(changedFixedToFluid).toBeTruthy()
  })

  it(`should return true for different length fluid array prop`, () => {
    const fluidChangedArrayMock = {
      fluid: [...fluidArrayMock.fluid, fluidShapeMock],
    }
    // fluidChangedArrayMock.fluid.push(fluidShapeMock)

    const changedFluid = imagePropsChanged(
      fluidArrayMock,
      fluidChangedArrayMock
    )
    expect(changedFluid).toBeTruthy()
  })

  it(`should return true for different length fluid array prop`, () => {
    const fixedChangedArrayMock = {
      fixed: [...fixedArrayMock.fixed, fluidShapeMock],
    }
    // fluidChangedArrayMock.fluid.push(fluidShapeMock)

    const changedFixed = imagePropsChanged(
      fixedArrayMock,
      fixedChangedArrayMock
    )
    expect(changedFixed).toBeTruthy()
  })

  it(`should return true for fixed arrays with different sources`, () => {
    const secondFixedArrayMock = { ...fixedArrayMock }
    secondFixedArrayMock.fixed = [{ src: `different` }, { src: `different` }]
    const changedFixedToFluid = imagePropsChanged(
      fixedArrayMock,
      secondFixedArrayMock
    )
    expect(changedFixedToFluid).toBeTruthy()
  })

  it(`should return true for fluid arrays with different sources`, () => {
    const secondFluidArrayMock = { ...fluidArrayMock }
    secondFluidArrayMock.fluid = [{ src: `different` }, { src: `different` }]
    const changedFixedToFluid = imagePropsChanged(
      fluidArrayMock,
      secondFluidArrayMock
    )
    expect(changedFixedToFluid).toBeTruthy()
  })
})

describe(`getCurrentFromData() & getUrlString()`, () => {
  it(`getCurrentFromData() should return false for empty data & propName`, () => {
    const returnedString = getCurrentFromData({ data: null, propName: null })
    expect(returnedString).toBeFalsy()
  })

  it(`getCurrentFromData() should return string for data & propName`, () => {
    const returnedString = getCurrentFromData({
      data: [{ blubb: `http://some_image` }],
      propName: `blubb`,
    })
    expect(returnedString).toMatchInlineSnapshot(`"url(http://some_image)"`)
  })

  it(`getCurrentFromData() should return string for data as object & propName`, () => {
    const returnedString = getCurrentFromData({
      data: { blubb: `http://some_image` },
      propName: `blubb`,
    })
    expect(returnedString).toMatchInlineSnapshot(`"url('http://some_image')"`)
  })

  it(`getCurrentFromData() should return empty string for mismatched data as object & propName`, () => {
    const returnedString = getCurrentFromData({
      data: [{ blubb: null }],
      propName: `blubb`,
    })
    expect(returnedString).toMatchInlineSnapshot(`""`)
  })

  it(`getCurrentFromData() should return empty string for mismatched data & propName`, () => {
    const returnedString = getCurrentFromData({
      data: { test: null },
      propName: `blubb`,
    })
    expect(returnedString).toMatchInlineSnapshot(`""`)
  })

  it(`getCurrentFromData() should return string for data & propName tracedSVG`, () => {
    const returnedString = getCurrentFromData({
      data: [{ tracedSVG: `some_SVG` }],
      propName: `tracedSVG`,
    })
    expect(returnedString).toMatchInlineSnapshot(`"url(\\"some_SVG\\")"`)
  })

  it(`getCurrentFromData() should return string for data & propName CSS_STRING`, () => {
    const returnedString = getCurrentFromData({
      data: [`rgba(0,0,0,0.5)`],
      propName: `CSS_STRING`,
      addUrl: false,
    })
    expect(returnedString).toMatchInlineSnapshot(`"rgba(0,0,0,0.5)"`)
  })

  it(`getUrlString() should return  url encapsulated string`, () => {
    const returnedString = getUrlString({ imageString: `blubb` })
    expect(returnedString).toMatchInlineSnapshot(`"url(blubb)"`)
  })

  it(`getUrlString() should return url encapsulated string within array`, () => {
    const returnedString = getUrlString({ imageString: [`blubb`] })
    expect(returnedString).toMatchInlineSnapshot(`"url(blubb)"`)
  })

  it(`getUrlString() should return string without addUrl`, () => {
    const returnedString = getUrlString({ imageString: `blubb`, addUrl: false })
    expect(returnedString).toMatchInlineSnapshot(`"blubb"`)
  })
})

describe(`getCurrentFromData() with art-direction stack`, () => {
  const OLD_MATCH_MEDIA = window.matchMedia

  beforeEach(() => {
    window.matchMedia = jest.fn(media =>
      media === '(min-width: 1401px)'
        ? {
            matches: true,
          }
        : {
            matches: false,
          }
    )
  })

  afterEach(() => {
    window.matchMedia = OLD_MATCH_MEDIA
  })

  it(`getCurrentData() should return string for fluid art-direction stack`, () => {
    const returnedString = getCurrentFromData({
      data: mockArtDirectionStackFluid,
      propName: `src`,
      addUrl: false,
    })
    expect(returnedString).toMatchInlineSnapshot(`"test_fluid_image.jpg"`)
  })

  it(`getCurrentData() should return tracedSVG for fluid art-direction stack`, () => {
    const returnedString = getCurrentFromData({
      data: mockArtDirectionStackFluid,
      propName: `tracedSVG`,
      addUrl: false,
    })
    expect(returnedString).toMatchInlineSnapshot(`""`)
  })

  it(`getCurrentData() should return base64 for fluid art-direction stack`, () => {
    const returnedString = getCurrentFromData({
      data: mockArtDirectionStackFluid,
      propName: `base64`,
      addUrl: false,
    })
    expect(returnedString).toMatchInlineSnapshot(`"string_of_base64"`)
  })

  it(`getCurrentData() should return empty string for (illegal) fixed art-direction stack`, () => {
    const { src, ...testFixedMock } = fixedShapeMock
    const mockArtDirectionStackFixedDepleted = [
      testFixedMock,
      {
        ...testFixedMock,
        media: `(min-width: 491px)`,
      },
      {
        ...testFixedMock,
        media: `(min-width: 1401px)`,
      },
    ]
    const returnedString = getCurrentFromData({
      data: mockArtDirectionStackFixedDepleted,
      propName: `src`,
      addUrl: false,
    })
    expect(returnedString).toEqual('')
  })
})

describe(`getCurrentSrcData()`, () => {
  it(`shall return first image if findIndex returns no match (e.g. illegal media queries)`, () => {
    const mockArtDirectionStackFixedDepleted = [
      fixedShapeMock,
      {
        ...fixedShapeMock,
        media: ``,
      },
      {
        ...fixedShapeMock,
        media: ``,
      },
    ]
    const currentSrcData = getCurrentSrcData({
      fixed: mockArtDirectionStackFixedDepleted,
    })
    expect(currentSrcData).toEqual(fixedShapeMock)
  })
})

describe(`imageReferenceCompleted()`, () => {
  it(`should return false with undefined imageRef`, () => {
    expect(imageReferenceCompleted()).toBeFalsy()
  })
})

describe(`imageLoaded()`, () => {
  it(`should return false with undefined imageRef`, () => {
    expect(imageLoaded()).toBeFalsy()
  })
})

describe(`getSelectedImage()`, () => {
  it(`should return same image with singular fluid image`, () => {
    expect(getSelectedImage(fluidMock)).toEqual(fluidShapeMock)
  })

  it(`should return same image with singular fixed image`, () => {
    expect(getSelectedImage(fixedMock)).toEqual(fixedShapeMock)
  })

  it(`should return same image with singular fixed image`, () => {
    expect(getSelectedImage(fixedArrayMock, 2)).toEqual(fixedShapeMock)
  })
})
