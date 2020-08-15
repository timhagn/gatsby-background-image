import React from 'react'
import { render } from '@testing-library/react'
import { StaticQuery, useStaticQuery } from 'gatsby'
import IndexPage from '..'

// Necessary to fixate generated className.
jest.mock('short-uuid')

const fluidMock = {
  childImageSharp: {
    fluid: {
      aspectRatio: 1,
      sizes: `100 200 300`,
      src: `pretend-i-am-a-base64-encoded-image`,
      srcSet: `asdfasdf`,
    },
  },
}

const mockMetadata = {
  site: {
    siteMetadata: {
      title: `gbitest`,
      description: `A simple starter to show what gatsby-background-image can do.`,
      author: `Tim Hagn`,
    },
  },
}

describe('IndexPage', () => {
  beforeEach(() => {
    StaticQuery.mockImplementation(({ render }) => render({ ...mockMetadata }))
    useStaticQuery.mockImplementation(() => ({
      desktop: fluidMock,
      placeholderImage: fluidMock,
      ...mockMetadata,
    }))
    // Freeze generated className.
    const uuid = require('short-uuid')
    uuid.generate.mockImplementation(() => '73WakrfVbNJBaAmhQtEeDv')
  })

  it('renders correctly', () => {
    const { container } = render(<IndexPage />)
    expect(container).toMatchSnapshot()
  })
})
