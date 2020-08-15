import React from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import styled from 'styled-components'

import BackgroundImage from '../../../packages/gatsby-background-image/src'
import { StyledFullScreenWrapper } from './SharedStyledComponents'

/**
 * In this functional component a fullscreen <BackgroundImage />  is created.
 * @param className   string    className(s) from styled-components.
 * @param children    nodes     Child-components.
 * @return {*}
 * @constructor
 */
const FullBackground = ({ className, children }) => {
  const { desktop } = useStaticQuery(
    graphql`
      query {
        desktop: file(relativePath: { eq: "seamless-bg-desktop.jpg" }) {
          childImageSharp {
            fluid(quality: 90, maxWidth: 4160) {
              ...GatsbyImageSharpFluid_withWebp_tracedSVG
            }
          }
        }
      }
    `
  )

  // Single Image Data
  const imageData = desktop.childImageSharp.fluid

  return (
    <StyledFullScreenWrapper>
      <BackgroundImage
        Tag="section"
        className={className}
        fluid={imageData}
        backgroundColor={`#040e18`}
        title="Fullscreen Background"
        id="fullscreenbg"
        role="img"
        aria-label="Fullscreen Background"
        preserveStackingContext
      >
        {children}
      </BackgroundImage>
    </StyledFullScreenWrapper>
  )
}

const StyledFullBackground = styled(FullBackground)`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`

export default StyledFullBackground
