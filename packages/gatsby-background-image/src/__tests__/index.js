import { render } from '@testing-library/react'

import React from 'react'
import {
  fixedShapeMock,
  fluidShapeMock,
  setupBackgroundImage,
} from './mocks/Various.mock'
import BackgroundImage from '../'
import { activateCacheForImage, resetImageCache } from '../lib/ImageUtils'
import { resetComponentClassCache } from '../lib/StyleUtils'

afterEach(resetImageCache)

global.console.debug = jest.fn()

let elements = []

jest.mock('short-uuid')

describe(`<BackgroundImage />`, () => {
  const observe = jest.fn(callback => elements.push(callback))
  const unobserve = jest.fn(callback => elements.unshift(callback))
  const tmpRnd = Math.random
  beforeEach(() => {
    global.IntersectionObserver = jest.fn(() => ({
      observe,
      unobserve,
    }))
    resetImageCache()
    // Mock Math.random beforehand, lest another random classname is created.
    Math.random = jest.fn(() => 0.424303425546642)
    // Freeze StyleUtils#fixClassName.
    const uuid = require('short-uuid')
    uuid.generate.mockImplementation(() => '73WakrfVbNJBaAmhQtEeDv')
  })
  afterEach(() => {
    Math.random = tmpRnd
    resetComponentClassCache()
  })

  it(`should render fixed size images`, () => {
    const component = setupBackgroundImage({})
    expect(component).toMatchSnapshot()
  })

  it(`should render stacked fixed size images`, () => {
    const component = setupBackgroundImage({ multiImage: true })
    expect(component).toMatchSnapshot()
  })

  it(`should call critical fixed images`, () => {
    activateCacheForImage({ fixed: fixedShapeMock })
    const options = {
      addClass: true,
      critical: true,
      fixed: true,
    }
    const component = setupBackgroundImage(options)
    expect(component).toMatchSnapshot()
  })

  it(`should call multiple critical fixed images`, () => {
    activateCacheForImage({ fixed: [fixedShapeMock, fixedShapeMock] })
    const options = {
      addClass: true,
      critical: true,
      fixed: true,
      multiImage: true,
    }
    const component = setupBackgroundImage(options)
    expect(component).toMatchSnapshot()
  })

  it(`should render fluid images`, () => {
    const component = setupBackgroundImage({ fluid: true })
    expect(component).toMatchSnapshot()
  })

  it(`should render without opacity hack with truthy preserveStackingContext`, () => {
    const component = setupBackgroundImage({ fluid: true, props: {preserveStackingContext: true} })
    expect(component).toMatchSnapshot()
  })

  it(`should render multiple fluid images`, () => {
    const component = setupBackgroundImage({ fluid: true, multiImage: true })
    expect(component).toMatchSnapshot()
  })

  it(`should call critical fluid images`, () => {
    activateCacheForImage({ fluid: fluidShapeMock })
    const options = {
      fluid: true,
      addClass: true,
      critical: true,
    }
    const component = setupBackgroundImage(options)
    expect(component).toMatchSnapshot()
  })

  it(`should call multiple critical fluid images`, () => {
    activateCacheForImage({ fluid: [fluidShapeMock, fluidShapeMock] })
    const options = {
      fluid: true,
      addClass: true,
      critical: true,
      multiImage: true,
    }
    const component = setupBackgroundImage(options)
    expect(component).toMatchSnapshot()
  })

  it(`should work without external class`, () => {
    const { container } = render(
      <BackgroundImage fluid={fluidShapeMock}>
        <h1>testempty</h1>
      </BackgroundImage>
    )
    expect(container).toMatchSnapshot()
  })

  it(`should change style.display from 'inherit' to 'inline-block'`, () => {
    const { container } = render(
      <BackgroundImage fixed={fixedShapeMock} style={{ display: `inherit` }}>
        <h1>testempty</h1>
      </BackgroundImage>
    )
    expect(container).toMatchSnapshot()
  })

  it(`should work with another external class`, () => {
    activateCacheForImage({ fluid: fluidShapeMock })
    const options = {
      fluid: true,
      addClass: true,
      additionalClass: `test`,
    }
    const component = setupBackgroundImage(options)
    expect(component).toMatchSnapshot()
  })

  it(`should return null without fluid / fixed`, () => {
    const options = {
      fixedClass: false,
      onLoad: null,
      onError: null,
      onStartLoad: null,
      fixed: false,
    }
    const component = setupBackgroundImage(options)
    expect(component).toMatchSnapshot()
  })

  it(`should work with only classId`, () => {
    const options = {
      fluid: true,
      fixedClass: false,
      addClassId: false,
      addBackgroundColor: false,
    }
    const component = setupBackgroundImage(options)
    expect(component).toMatchSnapshot()
  })

  it(`should work without classId but className`, () => {
    const options = {
      fluid: true,
      additionalClass: `test`,
      fixed: false,
      addClassId: false,
      addBackgroundColor: false,
    }
    const component = setupBackgroundImage(options)
    expect(component).toMatchSnapshot()
  })

  it(`should work with BackgroundColor`, () => {
    const options = {
      fluid: true,
      fixedClass: false,
      fixed: false,
      addClassId: false,
      addBackgroundColor: `#fff`,
    }
    const component = setupBackgroundImage(options)
    expect(component).toMatchSnapshot()
  })

  it(`should work with fadeIn`, () => {
    const options = {
      fluid: true,
      fixedClass: false,
      fixed: false,
      addClassId: false,
      fadeIn: true,
    }
    const component = setupBackgroundImage(options)
    expect(component).toMatchSnapshot()
  })

  it(`should create style tag with pseudo-elements`, () => {
    const options = {
      additionalClass: `test`,
    }
    const component = setupBackgroundImage(options)
    const styleTag = component.querySelector(`style`)
    expect(styleTag).toBeInTheDocument()
    expect(styleTag).toMatchSnapshot()
  })

  it(`should create style tag at fixed with pseudo-elements`, () => {
    const options = {
      addClass: true,
      additionalClass: `test`,
    }
    const component = setupBackgroundImage(options)
    const styleTag = component.querySelector(`style`)
    expect(styleTag).toBeInTheDocument()
    expect(styleTag).toMatchSnapshot()
  })

  it(`should have class with pseudo element in style tag`, () => {
    const options = {
      fluid: true,
      addClass: true,
      additionalClass: `test`,
    }
    const component = setupBackgroundImage(options)
    const styleTag = component.querySelector(`style`)
    expect(styleTag).toHaveTextContent(`.gatsby-background-image-test:before`)
    expect(styleTag).toHaveTextContent(`background-repeat: 'repeat-y';`)
    expect(styleTag).toHaveTextContent(`background-position: 'center';`)
    expect(styleTag).toHaveTextContent(`background-size: 'contain';`)
  })
})
