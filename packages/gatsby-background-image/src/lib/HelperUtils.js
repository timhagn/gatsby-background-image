import filterInvalidDOMProps from 'filter-invalid-dom-props'
import { groupByMedia, hasArtDirectionSupport } from './MediaUtils'

/**
 * Strip BackgroundImage propTypes from remaining props to be passed to <Tag />
 *
 * @param props
 * @return {Object}
 */
export const stripRemainingProps = props => filterInvalidDOMProps(props)

/**
 * Preprocess art directed images.
 *
 * @param props
 * @return {Object}
 */
export const convertProps = props => {
  const convertedProps = { ...props }
  const { fixed, fluid } = convertedProps

  // if (fluid && !hasImageArray(props)) {
  //   convertedProps.fluid = [].concat(fluid)
  // }
  //
  // if (fixed && !hasImageArray(props)) {
  //   convertedProps.fixed = [].concat(fixed)
  // }

  // convert fluid & fixed to arrays so we only have to work with arrays
  if (fluid && hasArtDirectionSupport(props, 'fluid')) {
    convertedProps.fluid = groupByMedia(convertedProps.fluid)
  }
  if (fixed && hasArtDirectionSupport(props, 'fixed')) {
    convertedProps.fixed = groupByMedia(convertedProps.fixed)
  }

  return convertedProps
}
