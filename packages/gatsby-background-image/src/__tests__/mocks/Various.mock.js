import { render } from '@testing-library/react'

import React from 'react'
import BackgroundImage from '../../index'

export const fixedShapeMock = {
  width: 100,
  height: 100,
  src: `test_fixed_image.jpg`,
  srcSet: `some srcSet`,
  srcSetWebp: `some srcSetWebp`,
  base64: `string_of_base64`,
}

export const fluidShapeMock = {
  aspectRatio: 1.5,
  src: `test_fluid_image.jpg`,
  srcSet: `some srcSet`,
  srcSetWebp: `some srcSetWebp`,
  sizes: `(max-width: 600px) 100vw, 600px`,
  base64: `string_of_base64`,
}

export const fixedMock = {
  fixed: fixedShapeMock,
}

export const fluidMock = {
  fluid: fluidShapeMock,
}

export const mockArtDirectionStackFluid = [
  fluidShapeMock,
  {
    ...fluidShapeMock,
    media: `(min-width: 491px)`,
  },
  {
    ...fluidShapeMock,
    media: `(min-width: 1401px)`,
  },
]

export const mockArtDirectionStackFixed = [
  fixedShapeMock,
  {
    ...fixedShapeMock,
    media: `(min-width: 491px)`,
  },
  {
    ...fixedShapeMock,
    media: `(min-width: 1401px)`,
  },
]

export const fixedArrayMock = {
  fixed: [fixedShapeMock, fixedShapeMock],
}

export const fluidArrayMock = {
  fluid: [fluidShapeMock, fluidShapeMock],
}

export const createStyleElement = () => {
  // Create the style class.
  const styleElement = document.createElement('style')
  styleElement.textContent = `
        .imageClass {
          backgroundRepeat: 'repeat-y';
          backgroundPosition: 'center';
          backgroundSize: 'contain';
        }
      `
  document.body.appendChild(styleElement)
}

/**
 * Sets up a (@testing-library/react) rendered container.
 *
 * @param fluid
 * @param addClass
 * @param additionalClass
 * @param fixedClass
 * @param onLoad
 * @param onError
 * @param critical
 * @param onStartLoad
 * @param fixed
 * @param addClassId
 * @param addBackgroundColor
 * @param fadeIn
 * @param props
 * @param multiImage
 * @return {RenderResult.container}
 */
export const setupBackgroundImage = ({
  fluid = false,
  addClass = false,
  additionalClass = ``,
  fixedClass = true,
  onLoad = () => {},
  onError = () => {},
  critical = false,
  onStartLoad = null,
  fixed = true,
  addClassId = true,
  addBackgroundColor = true,
  fadeIn = false,
  props = {},
  multiImage = false,
}) => {
  if (addClass) {
    createStyleElement()
  }
  const currentFixedMock = multiImage
    ? { fixed: [fixedShapeMock, fixedShapeMock] }
    : { fixed: fixedShapeMock }
  const currentFluidMock = multiImage
    ? { fluid: [fluidShapeMock, fluidShapeMock] }
    : { fluid: fluidShapeMock }
  const classNames = fixedClass
    ? `imageClass ${additionalClass}`
    : additionalClass.trim()
  const { container } = render(
    <BackgroundImage
      {...(addBackgroundColor && { backgroundColor: addBackgroundColor })}
      {...(fixedClass && { className: classNames })}
      style={{ display: `inline`, opacity: 0.99 }}
      title={`Title for the image`}
      alt={`Alt text for the image`}
      id={`testid`}
      {...(fluid && currentFluidMock)}
      {...(!fluid && fixed && currentFixedMock)}
      onLoad={onLoad}
      onError={onError}
      {...(addClassId && { classId: `test` })}
      critical={critical}
      onStartLoad={onStartLoad}
      {...(fadeIn && { fadeIn: `soft` })}
      {...props}
    >
      <h1>test</h1>
    </BackgroundImage>
  )

  return container
}
