/**
 * @jest-environment node
 */

import '@testing-library/react/dont-cleanup-after-each'

const GBI = require('gatsby-background-image').default
const GBIES5 = require('gatsby-background-image-es5').default

describe(`<BackgroundImage /> in gatsby-background-image-es5`, () => {
  it(`should create new BackgroundImage instance`, () => {
    const component = new GBIES5({
      fadeIn: true,
    })
    expect(component).toMatchSnapshot()
  })
})

describe(`<BackgroundImage /> in gatsby-background-image`, () => {
  it(`should create new BackgroundImage instance`, () => {
    const component = new GBI({
      fadeIn: true,
    })
    expect(component).toMatchSnapshot()
  })
})
