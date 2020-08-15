import React from 'react'
import styled from 'styled-components'

import Layout from '../components/Layout'
import SEO from '../components/SEO'
import { StyledContentCenterWrapper } from '../components/SharedStyledComponents'
import ArtDirectedFullBackground from '../components/ArtDirectedFullBackground'

const StyledCenterWrapper = styled(StyledContentCenterWrapper)`
  max-width: 800px;
`

const ArtDirectedImages = () => (
  <Layout>
    <SEO title="Art Directed Background Images" />
    <ArtDirectedFullBackground>
      <StyledCenterWrapper>
        <h1>Art Directed Background Images</h1>
        <p>
          The Image in the background is chosen by its <code>media</code> props
          <code>min-width</code>.
        </p>
      </StyledCenterWrapper>
    </ArtDirectedFullBackground>
  </Layout>
)

export default ArtDirectedImages
