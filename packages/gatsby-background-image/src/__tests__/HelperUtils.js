import { convertProps } from '../lib/HelperUtils'
import {
  mockArtDirectionStackFixed,
  mockArtDirectionStackFluid,
} from './mocks/Various.mock'
import { groupByMedia } from '../lib/MediaUtils'

describe(`convertProps()`, () => {
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
