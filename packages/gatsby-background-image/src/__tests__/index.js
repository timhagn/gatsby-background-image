import "@babel/polyfill"
import { render, cleanup, fireEvent } from "react-testing-library"
import React from "react"
import BackgroundImage from "../"
import getBackgroundStyles from "../BackgroundUtils";

afterAll(cleanup)

const fixedShapeMock = {
  width: 100,
  height: 100,
  src: `test_image.jpg`,
  srcSet: `some srcSet`,
  srcSetWebp: `some srcSetWebp`,
  base64: `string_of_base64`,
}

const fluidShapeMock = {
  aspectRatio: 1.5,
  src: `test_image.jpg`,
  srcSet: `some srcSet`,
  srcSetWebp: `some srcSetWebp`,
  sizes: `(max-width: 600px) 100vw, 600px`,
  base64: `string_of_base64`,
}

const setup = (fluid = false,
               addClass = false,
               additionalClass = ``,
               fixedClass = true,
               onLoad = () => {},
               onError = () => {}) => {

  if (addClass) {
    // Create the style class.
    const styleElement = document.createElement("style")
    styleElement.textContent = `
      .fixedImage {
        backgroundRepeat: 'repeat-y';
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
      style={{ display: `inline` }}
      title={`Title for the image`}
      alt={`Alt text for the image`}
      {...fluid && { fluid: fluidShapeMock }}
      {...!fluid && { fixed: fixedShapeMock }}
      onLoad={onLoad}
      onError={onError}
      placeholderStyle={{ color: `red` }}
      placeholderClassName={`placeholder`}
      classId="test"
    />
  )

  return container
}

describe(`<BackgroundImage />`, () => {
  it(`should render fixed size images`, () => {
    const component = setup()
    expect(component).toMatchSnapshot()
  })

  it(`should render fluid images`, () => {
    const component = setup(true)
    expect(component).toMatchSnapshot()
  })

  it(`should work with single external class`, () => {
    const component = setup(true)
    expect(component).toMatchSnapshot()
  })

  it(`should work with another external class`, () => {
    const component = setup(true, true, ` test`)
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
  })

  it(`should parse background styles`, () => {
    const backgroundStyles = getBackgroundStyles(``)
    expect(backgroundStyles).toEqual({})
  })

  it(`should have correct src, title and alt attributes`, () => {
    const imageTag = setup().querySelector(`picture img`)
    expect(imageTag.getAttribute(`src`)).toEqual(`test_image.jpg`)
    expect(imageTag.getAttribute(`title`)).toEqual(`Title for the image`)
    expect(imageTag.getAttribute(`alt`)).toEqual(`Alt text for the image`)
  })

  it(`should have correct placeholder src, title, style and class attributes`, () => {
    const placeholderImageTag = setup().querySelector(`img`)
    expect(placeholderImageTag.getAttribute(`src`)).toEqual(`string_of_base64`)
    expect(placeholderImageTag.getAttribute(`title`)).toEqual(
      `Title for the image`
    )
    // No Intersection Observer in JSDOM, so placeholder img will be visible (opacity 1) by default
    expect(placeholderImageTag.getAttribute(`style`)).toEqual(

      `position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; opacity: 1; color: red; display: none;`
    )
    expect(placeholderImageTag.getAttribute(`class`)).toEqual(`placeholder`)
  })

  it(`should call onLoad and onError image events`, () => {
    const onLoadMock = jest.fn()
    const onErrorMock = jest.fn()
    const imageTag = setup(true, false, ``, true, onLoadMock, onErrorMock).querySelector(
      `picture img`
    )
    fireEvent.load(imageTag)
    fireEvent.error(imageTag)

    expect(onLoadMock).toHaveBeenCalledTimes(1)
    expect(onErrorMock).toHaveBeenCalledTimes(1)
  })
})
