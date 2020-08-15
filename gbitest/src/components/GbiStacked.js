import React from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import styled from 'styled-components'
import BackgroundImage from '../../../packages/gatsby-background-image/src'

/**
 * This component demonstrates how to use multiple stacked background images.
 * @return {*}
 * @constructor
 */
const GbiStacked = () => {
  const { bubbles, firefox } = useStaticQuery(
    graphql`
      query {
        bubbles: file(relativePath: { eq: "bubbles.png" }) {
          childImageSharp {
            fluid(quality: 90, maxWidth: 1280) {
              ...GatsbyImageSharpFluid_withWebp_noBase64
            }
          }
        }
        firefox: file(relativePath: { eq: "firefox.png" }) {
          childImageSharp {
            fluid(quality: 90, maxWidth: 223) {
              ...GatsbyImageSharpFluid_withWebp_noBase64
            }
          }
        }
      }
    `
  )

  // Multiple Background Array
  const firefoxExampleFluidImageStack = [
    firefox.childImageSharp.fluid,
    bubbles.childImageSharp.fluid,
    `linear-gradient(to right, rgba(30, 75, 115, 1), rgba(255, 255, 255, 0))`,
  ]

  return (
    <StyledStackedBackgrounds
      Tag="div"
      fluid={firefoxExampleFluidImageStack}
      id="imagestack"
      role="img"
      aria-label="A GBI background stack with the firefox example"
      critical
      style={{
        backgroundColor: 'white',
        backgroundRepeat: 'no-repeat, no-repeat, no-repeat',
        backgroundPosition: 'bottom right, left, right',
        backgroundSize: '',
      }}
    />
  )
}

const StyledStackedBackgrounds = styled(BackgroundImage)`
  width: 600px;
  height: 400px;

  // Uncomment the following to demo hover effects.
  //&:before, &:after {
  //  visibility: hidden;
  //}
  //
  //&:hover {
  //  &:before, &:after {
  //    visibility: visible;
  //  }
  //}
`

export default GbiStacked
