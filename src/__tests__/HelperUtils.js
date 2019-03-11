import '@babel/polyfill'
import { convertProps } from '../HelperUtils'
import { fixedShapeMock, fluidShapeMock } from './index'

const legacySizesFixedMock = {
  resolutions: fixedShapeMock,
}

const legacyResolutionsFluidMock = {
  sizes: fluidShapeMock,
}

describe(`convertProps()`, () => {
  it(`should return convertedProps for legacy fixed resolutions prop`, () => {
    const convertedProps = convertProps(legacySizesFixedMock)
    expect(convertedProps.fixed).toEqual(fixedShapeMock)
  })

  it(`should return convertedProps for legacy fluid sizes prop`, () => {
    const convertedProps = convertProps(legacyResolutionsFluidMock)
    expect(convertedProps.fluid).toEqual(fluidShapeMock)
  })
})