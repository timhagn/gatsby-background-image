import React from 'react'
import { render } from '@testing-library/react'
import { StaticQuery, useStaticQuery } from 'gatsby'
import SEOPage from '../SEO'

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
  })

  it('renders correctly', () => {
    const { container } = render(<SEOPage title={'test'} />)
    expect(container).toMatchSnapshot()
  })
})
