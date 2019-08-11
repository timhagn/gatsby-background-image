/**
 * @jest-environment node
 */

import '@testing-library/react/dont-cleanup-after-each'

import React from 'react'
import ReactDOMServer from 'react-dom/server'
import BackgroundImage from '../index'
import { fixedShapeMock, fluidShapeMock } from './mocks/Various.mock'

describe (`<BackgroundImage /> on SSR`, () => {
  it (`should work within SSR node environment`, () => {
    // Mock Math.random beforehand, lest another random classname is created.
    Math.random = jest.fn(() => 0.424303425546642)
    const renderedBackgroundImage = ReactDOMServer.renderToString(
      <BackgroundImage fluid={fluidShapeMock}>
        <h1>testempty</h1>
      </BackgroundImage>
    )
    expect(renderedBackgroundImage).toMatchSnapshot()
  })

  it (`should work with multiple images in SSR node environment`, () => {
    // Mock Math.random beforehand, lest another random classname is created.
    Math.random = jest.fn(() => 0.424303425546642)
    const renderedBackgroundImage = ReactDOMServer.renderToString(
      <BackgroundImage fixed={[fixedShapeMock, fixedShapeMock]}>
        <h1>testempty</h1>
      </BackgroundImage>
    )
    expect(renderedBackgroundImage).toMatchSnapshot()
  })
})
