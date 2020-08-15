import React from 'react'
import PropTypes from 'prop-types'

const Footer = () => (
  <footer
    style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      background: `#00446f`,
      zIndex: 1,
      width: `100vw`,
      padding: `1rem`,
      textAlign: `center`,
      color: `white`,
    }}
  >
    © {new Date().getFullYear()}, Built with
    {` `}
    <a href="https://www.gatsbyjs.org">Gatsby</a>
    {` & `}
    <a href="https://github.com/timhagn/gatsby-background-image">
      gatsby-background-image
    </a>
  </footer>
)

Footer.propTypes = {
  siteTitle: PropTypes.string,
}

Footer.defaultProps = {
  siteTitle: ``,
}

export default Footer
