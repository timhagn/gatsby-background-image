import { convertProps, logDeprecationNotice } from '../lib/HelperUtils'
import {
  fixedShapeMock,
  fluidShapeMock,
  mockArtDirectionStackFixed,
  mockArtDirectionStackFluid,
} from './mocks/Various.mock'
import { groupByMedia } from '../lib/MediaUtils'

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

  it(`should return convertedProps for fluid art-direction stack`, () => {
    const convertedProps = convertProps({ fluid: mockArtDirectionStackFluid })
    expect(convertedProps.fluid).toEqual(
      groupByMedia(mockArtDirectionStackFluid)
    )
  })

  it(`should return convertedProps for fixed art-direction stack`, () => {
    const convertedProps = convertProps({ fixed: mockArtDirectionStackFixed })
    expect(convertedProps.fixed).toEqual(
      groupByMedia(mockArtDirectionStackFixed)
    )
  })
})

describe(`logDeprecationNotice()`, () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    global.console.log = jest.fn()
    jest.resetModules() // this is important - it clears the cache
    process.env = { ...OLD_ENV }
    delete process.env.NODE_ENV
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  it(`should log a message`, () => {
    process.env.NODE_ENV = `develop`
    logDeprecationNotice(`test`)
    expect(global.console.log).toHaveBeenCalledTimes(1)
  })

  it(`should log a message and a notice`, () => {
    process.env.NODE_ENV = `develop`
    logDeprecationNotice(`test`, `should be replaced`)
    expect(global.console.log).toHaveBeenCalledTimes(2)
  })

  it(`should return in production`, () => {
    process.env.NODE_ENV = 'production'
    logDeprecationNotice(`test`, `should be replaced`)
    expect(global.console.log).toHaveBeenCalledTimes(0)
  })
})
