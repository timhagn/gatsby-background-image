import '@babel/polyfill'
import { render, cleanup, fireEvent } from 'react-testing-library'
import React from 'react'
import BackgroundImage from '../'
import { createPictureRef } from '../ImageUtils'


global.console.debug = jest.fn()

afterAll(cleanup)


export const fixedShapeMock = {
  width: 100,
  height: 100,
  src: `test_fixed_image.jpg`,
  srcSet: `some srcSet`,
  srcSetWebp: `some srcSetWebp`,
  base64: `string_of_base64`,
}

export const fluidShapeMock = {
  aspectRatio: 1.5,
  src: `test_fluid_image.jpg`,
  srcSet: `some srcSet`,
  srcSetWebp: `some srcSetWebp`,
  sizes: `(max-width: 600px) 100vw, 600px`,
  base64: `string_of_base64`,
}

/**
 * Sets up a (react-testing-library) rendered container.
 *
 * @param fluid
 * @param addClass
 * @param additionalClass
 * @param fixedClass
 * @param onLoad
 * @param onError
 * @param critical
 * @param onStartLoad
 * @param fixed
 * @return {RenderResult.container}
 */
const setup = (fluid = false,
               addClass = false,
               additionalClass = ``,
               fixedClass = true,
               onLoad = () => {},
               onError = () => {},
               critical = false,
               onStartLoad = null,
               fixed = true) => {

  if (addClass) {
    // Create the style class.
    const styleElement = document.createElement("style")
    styleElement.textContent = `
      .fixedImage {
        backgroundRepeat: 'repeat-y';
        backgroundPosition: 'center';
        backgroundSize: 'contain';
      }
    `
    document.body.appendChild(styleElement)
  }
  const classNames = fixedClass ?
      `fixedImage${additionalClass}` : additionalClass.trim()
  const { container } = render(
    <BackgroundImage
      backgroundColor
      className={classNames}
      style={{ display: `inline`, opacity: .99 }}
      title={`Title for the image`}
      alt={`Alt text for the image`}
      id={`testid`}
      {...fluid && { fluid: fluidShapeMock }}
      {...(!fluid && fixed) && { fixed: fixedShapeMock }}
      onLoad={onLoad}
      onError={onError}
      placeholderStyle={{ color: `red` }}
      placeholderClassName={`placeholder`}
      classId="test"
      critical={critical}
      onStartLoad={onStartLoad}
    ><h1>test</h1></BackgroundImage>
  )

  return container
}

describe(`<BackgroundImage />`, () => {
  beforeEach(() => {
    global.IntersectionObserver = jest.fn(() => ({
      observe: jest.fn(),
    }))
  })

  it(`should render fixed size images`, () => {
    const component = setup()
    expect(component).toMatchSnapshot()
  })

  it(`should call critical fixed images`, () => {
    const component = setup(false, true, ``, true, null, null, true)
    expect(component).toMatchSnapshot()
  })

  it(`should render fluid images`, () => {
    const component = setup(true)
    expect(component).toMatchSnapshot()
  })

  it(`should call critical fluid images`, () => {
    const component = setup(true, true, ``, true, null, null, true)
    expect(component).toMatchSnapshot()
  })

  it(`should work without external class`, () => {
    // Mock Math.random beforehand, lest another random classname is created.
    Math.random = jest.fn(() => 0.424303425546642)
    const { container } = render(
        <BackgroundImage
            fluid={ fluidShapeMock }
        ><h1>testempty</h1></BackgroundImage>
    )
    expect(container).toMatchSnapshot()
  })

  it(`should change style.display from 'inherit' to 'inline-block'`, () => {
    // Mock Math.random beforehand, lest another random classname is created.
    Math.random = jest.fn(() => 0.424303425546642)
    const { container } = render(
        <BackgroundImage
            fixed={ fixedShapeMock }
            style={{ display: `inherit` }}
        ><h1>testempty</h1></BackgroundImage>
    )
    expect(container).toMatchSnapshot()
  })

  it(`should work with single external class`, () => {
    const component = setup(true)
    expect(component).toMatchSnapshot()
  })

  it(`should work with another external class`, () => {
    const component = setup(true, true, ` test`)
    expect(component).toMatchSnapshot()
  })

  it(`should return null without fluid / fixed`, () => {
    const component = setup(false, false, ``, false, null, null, false, null, false)
    expect(component).toMatchSnapshot()
  })

  it(`should create style tag with pseudo-elements`, () => {
    const styleTag = setup(true, true, ` test`).querySelector(`style`)
    expect(styleTag).toBeInTheDocument()
    expect(styleTag).toMatchSnapshot()
  })

  it(`should create style tag at fixed with pseudo-elements`, () => {
    const styleTag = setup(false, true, ` test`).querySelector(`style`)
    expect(styleTag).toBeInTheDocument()
    expect(styleTag).toMatchSnapshot()
  })

  it(`should have class with pseudo element in style tag`, () => {
    const styleTag = setup(true, true, ` test`).querySelector(`style`)
    expect(styleTag)
        .toHaveTextContent(`.gatsby-background-image-test:before`)
    expect(styleTag)
        .toHaveTextContent(`background-repeat: 'repeat-y';`)
    expect(styleTag)
        .toHaveTextContent(`background-position: 'center';`)
    expect(styleTag)
        .toHaveTextContent(`background-size: 'contain';`)
  })

  it(`should call onLoad and onError image events`, () => {
    const onLoadMock = jest.fn()
    const onErrorMock = jest.fn()
    const image = createPictureRef({
      fluid: {
        src: ``,
      },
      onLoad: onLoadMock,
      onError: onErrorMock
    }, onLoadMock)
    fireEvent.load(image)
    fireEvent.error(image)

    expect(onLoadMock).toHaveBeenCalledTimes(2)
    expect(onErrorMock).toHaveBeenCalledTimes(1)
  })
})


describe(`<BackgroundImage /> without IO`, () => {
  beforeEach(() => {
    delete global.IntersectionObserver
  })

  it(`should call onLoadFunction without IO`, () => {
    const onLoadFunctionMock = jest.fn()
    const component = setup(true, true, ``, true, null, null, true, onLoadFunctionMock)
    expect(component).toMatchSnapshot()
    expect(onLoadFunctionMock).toHaveBeenCalled()
  })
})