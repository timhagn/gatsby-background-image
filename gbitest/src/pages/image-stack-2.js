import React from 'react'
import styled from 'styled-components'

import Layout from '../components/Layout'
import SEO from '../components/SEO'
import {
  StyledContentCenterWrapper,
  StyledImageWrapper,
} from '../components/SharedStyledComponents'
import GbiStacked from '../components/GbiStacked'
import StyledFullBackground from '../components/FullBackground'

const StyledCenterWrapper = styled(StyledContentCenterWrapper)`
  max-width: 800px;
  margin-top: 5rem;
`

const StyledOutsideLink = styled.a`
  margin-left: 0.32rem;
`

const MultipleStackedBackgroundImagesTwo = () => (
  <Layout>
    <SEO title="Multiple Stacked Background Images - second page" />
    <StyledFullBackground>
      <StyledCenterWrapper>
        <h1>Multiple Stacked Background Images</h1>
        <p>
          The Below Example is taken from the
          <StyledOutsideLink
            href="https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Backgrounds_and_Borders/Using_multiple_backgrounds"
            target="_blank"
            rel="nofollow noreferrer"
          >
            MDN Article about multiple backgrounds
          </StyledOutsideLink>
          .
        </p>
        <p> All attribution goes to them : )!</p>
        <StyledImageWrapper maxWidth={600}>
          <GbiStacked />
        </StyledImageWrapper>
      </StyledCenterWrapper>
    </StyledFullBackground>
  </Layout>
)

export default MultipleStackedBackgroundImagesTwo
