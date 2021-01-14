import React from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import styled from 'styled-components'
import Img from 'gatsby-image'
import { generateMedia } from 'styled-media-query'

import BackgroundImage from '../../../packages/gatsby-background-image/src'
// Use the following to support legacy browsers like IE11:
// import BackgroundImage from 'gatsby-background-image-es5'
import { StyledFullScreenWrapper } from './SharedStyledComponents'

const media = generateMedia()

/**
 * In this functional component a <BackgroundImage />  is compared to an <Img />.
 * @param className   string    className(s) from styled-components.
 * @param children    nodes     Child-components from index.js
 * @return {*}
 * @constructor
 */
const BackgroundSection = ({ className, children }) => {
  const { desktop } = useStaticQuery(
    graphql`
      query {
        desktop: file(relativePath: { eq: "seamless-bg-desktop.jpg" }) {
          childImageSharp {
            fluid(quality: 90, maxWidth: 4160) {
              ...GatsbyImageSharpFluid_withWebp
            }
          }
        }
      }
    `
  )

  const imageData = desktop.childImageSharp.fluid
  return (
    <StyledFullScreenWrapper>
      <StyledSymetryWrapper>
        <BackgroundImage
          Tag="section"
          className={className}
          // To style via external CSS see layout.css last examples:
          // className="test"
          fluid={imageData}
          backgroundColor={`#040e18`}
          // Title get's passed to both container and noscriptImg.
          title="gbitest"
          // style={{
          //   // Defaults are overwrite-able by setting one of the following:
          //   // backgroundSize: '',
          //   // backgroundPosition: '',
          //   // backgroundRepeat: '',
          // }}
          // To "force" the classic fading in of every image (especially on
          // imageData change for fluid / fixed) by setting `soft` on `fadeIn`:
          // fadeIn={`soft`}
          // To be able to use stacking context changing elements yourself,
          // set this to true to disable the "opacity hack":
          // preserveStackingContext={true}
          // You can "safely" (look them up beforehand ; ) add other props:
          id="gbitest"
          role="img"
          aria-label="gbitest"
          // Prevent the container from collapsing, should fluid / fixed be empty.
          keepStatic
        >
          {children}
        </BackgroundImage>
      </StyledSymetryWrapper>
      <StyledSymetryWrapper>
        <StyledWelcomeImage
          fluid={imageData}
          backgroundColor={`#040e18`}
          objectFit="cover"
          objectPosition="50% 50%"
        />
      </StyledSymetryWrapper>
    </StyledFullScreenWrapper>
  )
}

const StyledSymetryWrapper = styled.div`
  width: 50vw;
  height: 100%;
  overflow: hidden;
`

const StyledWelcomeImage = styled(Img)`
  width: 100vw;
  height: auto;
`

const StyledBackgroundSection = styled(BackgroundSection)`
  width: 100vw;

  // These three crucial styles (if existing) are directly parsed and added to
  // the pseudo-elements without further ado (except when overwritten).
  //background-repeat: repeat-y;
  //background-position: left center;
  //background-size: cover;

  // With media-queries you have to overwrite the default options (see style={{}} above).
  // ${media.lessThan('large')`
  //   background-size: cover;
  //   &:after, &:before {
  //     background-size: contain;
  //   }
  // `}

  // For pseudo-elements you have to overwrite the default options (see style={{}} above).
  // See: https://github.com/timhagn/gatsby-background-image/#styling--passed-through-styles
  //&:after, &:before {
  //   background-clip: content-box;
  //   background-size: contain;
  //}
`

export default StyledBackgroundSection
