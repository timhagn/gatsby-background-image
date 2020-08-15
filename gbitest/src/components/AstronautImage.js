import React from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import Img from 'gatsby-image'

/**
 * This component is built using `gatsby-background-image` to automatically
 * serve optimized background-images with lazy loading and reduced file sizes
 * as well as a `gatsby-image` for comparison.
 * The image is loaded using a `StaticQuery`, which allows us to load the image
 * from directly within this component, rather than having to pass
 * the image data down from pages.
 *
 * For more information, see the docs:
 * - `gatsby-background-image`: https://github.com/timhagn/gatsby-background-image
 * - `gatsby-image`: https://gatsby.dev/gatsby-image
 * - `StaticQuery`: https://gatsby.dev/staticquery
 */

const AstronautImage = () => {
  const { placeholderImage } = useStaticQuery(
    graphql`
      query {
        placeholderImage: file(relativePath: { eq: "gatsby-astronaut.png" }) {
          childImageSharp {
            fluid(maxWidth: 300) {
              ...GatsbyImageSharpFluid_withWebp_noBase64
            }
          }
        }
      }
    `
  )
  const image = placeholderImage.childImageSharp
  return <Img fluid={image.fluid} style={{ borderRadius: `15px` }} />
}
export default AstronautImage
