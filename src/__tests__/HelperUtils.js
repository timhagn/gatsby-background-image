import {
  convertProps,
  toCamelCase,
  toKebabCase,
  stringToArray,
} from '../HelperUtils'
import { fixedShapeMock, fluidShapeMock } from './mocks/Various.mock'

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

describe(`toCamelCase()`, () => {
  it(`should convert various words to camelCase`, () => {
    const testWords = [
      `background`,
      `background-image`,
      `object-position`,
      `GaRbL DIGOG`,
      `GaRbL    DIGOG    GIG`,
    ]
    const expected = [
      `background`,
      `backgroundImage`,
      `objectPosition`,
      `garblDigog`,
      `garblDigogGig`,
    ]
    testWords.forEach((wordToConvert, index) =>
      expect(toCamelCase(wordToConvert)).toEqual(expected[index])
    )
  })
})

describe(`toKebabCase()`, () => {
  it(`should convert various words to camelCase`, () => {
    const testWords = [
      `background`,
      `backgroundImage`,
      `objectPosition`,
      `WebkitTransitionDelay`,
      `GaRbL DIGOG`,
      `GaRbL    DIGOG    GIG`,
    ]
    const expected = [
      `background`,
      `background-image`,
      `object-position`,
      `-webkit-transition-delay`,
      `-ga-rb-l-d-i-g-o-g`,
      `-ga-rb-l-d-i-g-o-g-g-i-g`,
    ]
    testWords.forEach((wordToConvert, index) =>
      expect(toKebabCase(wordToConvert)).toEqual(expected[index])
    )
  })
})


describe(`stringToArray()`, () => {
  it(`should return array on array`, () => {
    const testConversion = stringToArray([])
    expect(testConversion instanceof Array).toBeTruthy()
  })
})
