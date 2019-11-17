import filterInvalidDOMProps from 'filter-invalid-dom-props'
import {
  groupByMedia,
  hasArtDirectionFixedArray,
  hasArtDirectionFluidArray,
} from './MediaUtils'

/**
 * Strip BackgroundImage propTypes from remaining props to be passed to <Tag />
 *
 * @param props
 * @return {Object}
 */
export const stripRemainingProps = props => filterInvalidDOMProps(props)

/**
 * Handle legacy names for image queries
 *
 * @param props
 * @return {Object}
 */
export const convertProps = props => {
  const convertedProps = { ...props }
  const { resolutions, sizes, classId, fixed, fluid } = convertedProps

  if (resolutions) {
    convertedProps.fixed = resolutions
    delete convertedProps.resolutions
  }
  if (sizes) {
    convertedProps.fluid = sizes
    delete convertedProps.sizes
  }

  if (classId) {
    logDeprecationNotice(
      `classId`,
      `gatsby-background-image should provide unique classes automatically. Open an Issue should you still need this property.`
    )
  }

  // if (fluid && !hasImageArray(props)) {
  //   convertedProps.fluid = [].concat(fluid)
  // }
  //
  // if (fixed && !hasImageArray(props)) {
  //   convertedProps.fixed = [].concat(fixed)
  // }

  // convert fluid & fixed to arrays so we only have to work with arrays
  if (fluid && hasArtDirectionFluidArray(props)) {
    convertedProps.fluid = groupByMedia(convertedProps.fluid)
  }
  if (fixed && hasArtDirectionFixedArray(props)) {
    convertedProps.fixed = groupByMedia(convertedProps.fixed)
  }

  return convertedProps
}

/**
 * Logs a warning if deprecated props where used.
 *
 * @param prop
 * @param notice
 */
export const logDeprecationNotice = (prop, notice) => {
  if (process.env.NODE_ENV === `production`) {
    return
  }

  console.log(
    `
    The "${prop}" prop is now deprecated and will be removed in the next major version
    of "gatsby-background-image".
    `
  )

  if (notice) {
    console.log(notice)
  }
}
