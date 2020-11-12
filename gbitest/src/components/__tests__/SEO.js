import React from 'react'
import { render } from '@testing-library/react'
import { StaticQuery, useStaticQuery } from 'gatsby'
import SEOPage from '../SEO'

// Necessary to fixate generated className.
jest.mock('short-uuid')

const mockMetadata = {
  site: {
    siteMetadata: {
      title: `gbitest`,
      description: `A simple starter to show what gatsby-background-image can do.`,
      author: `Tim Hagn`,
    },
  },
}

describe('SEO Page', () => {
  beforeEach(() => {
    StaticQuery.mockImplementation(({ render }) => render({ ...mockMetadata }))
    useStaticQuery.mockImplementation(() => ({
      ...mockMetadata,
    }))
    // Freeze generated className.
    const uuid = require('short-uuid')
    uuid.generate.mockImplementation(() => '73WakrfVbNJBaAmhQtEeDv')
  })

  it('renders correctly', () => {
    const { container } = render(<SEOPage title={'test'} />)
    expect(container).toMatchSnapshot()
  })
})
