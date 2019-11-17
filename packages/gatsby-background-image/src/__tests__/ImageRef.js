import {
  fixedArrayMock,
  fixedShapeMock,
  fluidArrayMock,
  fluidShapeMock,
  mockArtDirectionStackFluid,
} from './mocks/Various.mock'
import { activatePictureRef, createPictureRef } from '../lib/ImageRef'

describe(`createPictureRef()`, () => {
  it(`should return null on ssr or empty fluid / fixed prop`, () => {
    const emptyImageRef = createPictureRef({})
    expect(emptyImageRef).toBeNull()
  })

  it(`should return null on ssr or empty fluid / fixed prop & wrong type for onLoad`, () => {
    const emptyImageRef = createPictureRef({}, {})
    expect(emptyImageRef).toBeNull()
  })
})

describe(`createPictureRef() with crossOrigin`, () => {
  it(`should set crossOrigin`, () => {
    const emptyImageRef = createPictureRef({
      fluid: fluidShapeMock,
      crossOrigin: `anonymous`,
    })
    expect(emptyImageRef).toMatchInlineSnapshot(`
                                                                                                      <img
                                                                                                        crossorigin="anonymous"
                                                                                                      />
                                                                    `)
  })
})

describe(`createPictureRef() / activatePictureRef() without window`, () => {
  const tmpWindow = global.window
  beforeEach(() => {
    delete global.window
  })
  afterEach(() => {
    global.window = tmpWindow
  })

  it(`should fail without window`, () => {
    const emptyImageRef = createPictureRef({
      fluid: fluidShapeMock,
      critical: true,
    })
    expect(emptyImageRef).toBeNull()
  })

  it(`should fail without window`, () => {
    const testImg = new Image()
    const emptyImageRef = activatePictureRef(testImg, {
      fluid: fluidShapeMock,
      critical: true,
    })
    expect(emptyImageRef).toBeNull()
  })
})

describe(`createPictureRef() with critical image`, () => {
  it(`should preload image on critical`, () => {
    const imageRef = createPictureRef({
      fixed: fixedShapeMock,
      critical: true,
    })
    expect(imageRef).toMatchInlineSnapshot(`
      <img
        src="test_fixed_image.jpg"
        srcset="some srcSet"
      />
    `)
  })
  it(`should preload image on isVisible state`, () => {
    const imageRef = createPictureRef({
      fixed: fixedShapeMock,
      isVisible: true,
    })
    expect(imageRef).toMatchInlineSnapshot(`
      <img
        src="test_fixed_image.jpg"
        srcset="some srcSet"
      />
    `)
  })
  it(`should set empty strings for image on critical without src & srcSet`, () => {
    const fixedMock = { ...fixedShapeMock }
    fixedMock.src = ``
    fixedMock.srcSet = ``
    const emptyImageRef = createPictureRef({
      fixed: fixedMock,
      critical: true,
    })
    expect(emptyImageRef).toMatchInlineSnapshot(`
                                                                                                <img
                                                                                                  src=""
                                                                                                  srcset=""
                                                                                                />
                                                                `)
  })
})

describe(`createPictureRef() with image array`, () => {
  it(`should return imageRef array with fixed Array Mock`, () => {
    const imageRef = createPictureRef({
      ...fixedArrayMock,
      critical: true,
    })
    expect(imageRef).toMatchInlineSnapshot(`
      Array [
        <img
          src="test_fixed_image.jpg"
          srcset="some srcSet"
        />,
        <img
          src="test_fixed_image.jpg"
          srcset="some srcSet"
        />,
      ]
    `)
  })
})

describe(`activatePictureRef() with image array`, () => {
  const dummySelfRef = {
    offsetWidth: 500,
    offsetHeight: 500,
  }
  it(`should return imageRef array with fluid Array Mock`, () => {
    const testImg = new Image()
    const dummyImageRef = activatePictureRef(
      [testImg, testImg],
      {
        ...fluidArrayMock,
        critical: true,
      },
      dummySelfRef
    )
    expect(dummyImageRef).toMatchSnapshot()
  })

  it(`should return imageRef array with fluid Array Mock without selfRef`, () => {
    const testImg = new Image()
    const dummyImageRef = activatePictureRef([testImg, testImg], {
      ...fluidArrayMock,
      critical: true,
    })
    expect(dummyImageRef).toMatchSnapshot()
  })

  it(`should return imageRef array with fixed Array Mock`, () => {
    const testImg = new Image()
    const dummyImageRef = activatePictureRef(
      [testImg, testImg],
      {
        ...fixedArrayMock,
        critical: true,
      },
      dummySelfRef
    )
    expect(dummyImageRef).toMatchSnapshot()
  })
})

describe(`activatePictureRef() with art-direction stack`, () => {
  const dummySelfRef = {
    offsetWidth: 500,
    offsetHeight: 500,
  }
  it(`should return imageRef with fluid art-direction stack`, () => {
    const testImg = new Image()
    const dummyImageRef = activatePictureRef(
      testImg,
      {
        fluid: mockArtDirectionStackFluid,
      },
      dummySelfRef
    )
    expect(dummyImageRef).toMatchSnapshot()
  })
})
