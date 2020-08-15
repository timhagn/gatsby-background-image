import { Link } from 'gatsby'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import { StyledLink } from './SharedStyledComponents'

const StyledNavigation = styled.nav`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 0 auto 0.5rem;
  max-width: fit-content;
`

const StyledNavButton = styled(StyledLink)`
  background-color: ${props => {
    return typeof window !== 'undefined' &&
      document &&
      document.location.pathname === props.nav
      ? `rgba(0, 0, 0, 0.1)`
      : `rgba(0, 0, 0, 0.2)`
  }};
  border-radius: 5px;
  transition: all 300ms ease-in-out;
  padding: 0.5rem;
  text-decoration: none;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`

const Header = ({ siteTitle }) => (
  <header
    style={{
      background: `#00446f`,
      position: `fixed`,
      top: 0,
      left: 0,
      zIndex: 1,
      width: `100vw`,
    }}
  >
    <div
      style={{
        margin: `0 auto`,
        padding: `1.45rem 1.0875rem`,
      }}
    >
      <h1 style={{ margin: 0, textAlign: `center` }}>
        <Link
          to="/"
          style={{
            color: `white`,
            textDecoration: `none`,
          }}
        >
          {siteTitle}
        </Link>
      </h1>
    </div>
    <StyledNavigation>
      <StyledNavButton nav={'/'} to="/">
        Home
      </StyledNavButton>
      <StyledNavButton nav={'/image-stack/'} to="/image-stack/">
        Image Stack
      </StyledNavButton>
      <StyledNavButton nav={'/image-stack-2/'} to="/image-stack-2/">
        Image Stack
      </StyledNavButton>
      <StyledNavButton nav={'/art-direction/'} to="/art-direction/">
        Art Direction
      </StyledNavButton>
    </StyledNavigation>
  </header>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
