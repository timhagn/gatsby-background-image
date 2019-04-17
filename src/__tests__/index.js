import '@babel/polyfill'
import { render } from 'react-testing-library'
import 'react-testing-library/cleanup-after-each'

import React from 'react'
import BackgroundImage from '../'

global.console.debug = jest.fn()

let elements = []

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
 * @param addClassId
 * @param addBackgroundColor
 * @param fadeIn
 * @return {RenderResult.container}
 */
export const setup = (fluid = false,
               addClass = false,
               additionalClass = ``,
               fixedClass = true,
               onLoad = () => {},
               onError = () => {},
               critical = false,
               onStartLoad = null,
               fixed = true,
               addClassId = true,
               addBackgroundColor = true,
               fadeIn = false) => {

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
      { ...addBackgroundColor && {backgroundColor: addBackgroundColor}}
      { ...fixedClass && {className: classNames}}
      style={{ display: `inline`, opacity: .99 }}
      title={`Title for the image`}
      alt={`Alt text for the image`}
      id={`testid`}
      {...fluid && { fluid: fluidShapeMock }}
      {...(!fluid && fixed) && { fixed: fixedShapeMock }}
      onLoad={onLoad}
      onError={onError}
      { ...addClassId && {classId: `test`}}
      critical={critical}
      onStartLoad={onStartLoad}
      { ... fadeIn && {fadeIn: `soft`}}
    ><h1>test</h1></BackgroundImage>
  )

  return container
}

describe(`<BackgroundImage />`, () => {
  const observe = jest.fn(callback => elements.push(callback))
  const unobserve = jest.fn(callback => elements.unshift(callback))
  beforeEach(() => {
    global.IntersectionObserver = jest.fn(() => ({
      observe,
      unobserve,
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

  it(`should work with only classId`, () => {
    const component = setup(true, false, ``, false, null, null, false, null, false, false)
    expect(component).toMatchSnapshot()
  })

  it(`should work without classId but className`, () => {
    const component = setup(true, false, `test`, true, null, null, false, null, false, false)
    expect(component).toMatchSnapshot()
  })

  it(`should work with BackgroundColor`, () => {
    const component = setup(true, false, ``, false, null, null, false, null, false, false, `#fff`)
    expect(component).toMatchSnapshot()
  })

  it(`should work with fadeIn`, () => {
    const component = setup(true, false, ``, false, null, null, false, null, false, false, true, true)
    expect(component).toMatchSnapshot()
  })

  it(`should create style tag with pseudo-elements`, () => {
    const component = setup(true, true, ` test`)
    const styleTag = component.querySelector(`style`)
    expect(styleTag).toBeInTheDocument()
    expect(styleTag).toMatchSnapshot()
  })

  it(`should create style tag at fixed with pseudo-elements`, () => {
    const component = setup(false, true, ` test`)
    const styleTag = component.querySelector(`style`)
    expect(styleTag).toBeInTheDocument()
    expect(styleTag).toMatchSnapshot()
  })

  it(`should have class with pseudo element in style tag`, () => {
    const component = setup(true, true, ` test`)
    const styleTag = component.querySelector(`style`)
    expect(styleTag)
        .toHaveTextContent(`.gatsby-background-image-test:before`)
    expect(styleTag)
        .toHaveTextContent(`background-repeat: 'repeat-y';`)
    expect(styleTag)
        .toHaveTextContent(`background-position: 'center';`)
    expect(styleTag)
        .toHaveTextContent(`background-size: 'contain';`)
  })
})


