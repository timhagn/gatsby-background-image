import { fixedShapeMock, fluidShapeMock } from './mocks/Various.mock'
import {
  createArtDirectionSources,
  groupByMedia,
  matchesMedia,
} from '../lib/MediaUtils'

const fixedMock = {
  fixed: fixedShapeMock,
}

const fluidMock = {
  fluid: fluidShapeMock,
}

global.console.warn = jest.fn()

const mockArtDirectionStackFluid = [
  fluidMock.fluid,
  {
    ...fluidMock.fluid,
    media: `(min-width: 491px)`,
  },
  {
    ...fluidMock.fluid,
    media: `(min-width: 1401px)`,
  },
]

const mockArtDirectionStackFixed = [
  fixedMock.fixed,
  {
    ...fixedMock.fixed,
    media: `(min-width: 491px)`,
  },
  {
    ...fixedMock.fixed,
    media: `(min-width: 1401px)`,
  },
]

describe(`groupByMedia()`, () => {
  it(`should move the element without media to the end`, () => {
    const testGroupedMedia = groupByMedia(mockArtDirectionStackFluid)

    expect(testGroupedMedia instanceof Array).toBeTruthy()
    const lastElement = [...testGroupedMedia].pop()
    expect(lastElement).toEqual(
      expect.objectContaining(mockArtDirectionStackFluid[0])
    )
  })

  it(`should warn if elements without media present`, () => {
    const twoWithoutMediaStack = [
      ...mockArtDirectionStackFluid,
      fluidMock.fluid,
    ]
    groupByMedia(twoWithoutMediaStack)
    expect(global.console.warn).toHaveBeenCalled()
  })
})

describe(`createArtDirectionStack()`, () => {
  it(`should return an art-direction stack (fluid)`, () => {
    const testArtDirectionStack = createArtDirectionSources({
      fluid: mockArtDirectionStackFluid,
    })
    expect(testArtDirectionStack).toMatchInlineSnapshot(`
      Array [
        <source
          sizes="(max-width: 600px) 100vw, 600px"
          srcset="some srcSetWebp"
          type="image/webp"
        />,
        <source
          media="(min-width: 491px)"
          sizes="(max-width: 600px) 100vw, 600px"
          srcset="some srcSetWebp"
          type="image/webp"
        />,
        <source
          media="(min-width: 1401px)"
          sizes="(max-width: 600px) 100vw, 600px"
          srcset="some srcSetWebp"
          type="image/webp"
        />,
      ]
    `)
  })

  it(`should return an art-direction stack (fixed) also without srcSetWebp`, () => {
    const { srcSetWebp, ...testFixedMock } = fixedMock.fixed
    const testArtDirectionStack = createArtDirectionSources({
      fixed: [...mockArtDirectionStackFixed, testFixedMock],
    })
    expect(testArtDirectionStack).toMatchInlineSnapshot(`
      Array [
        <source
          sizes="undefined"
          srcset="some srcSetWebp"
          type="image/webp"
        />,
        <source
          media="(min-width: 491px)"
          sizes="undefined"
          srcset="some srcSetWebp"
          type="image/webp"
        />,
        <source
          media="(min-width: 1401px)"
          sizes="undefined"
          srcset="some srcSetWebp"
          type="image/webp"
        />,
        <source
          sizes="undefined"
          srcset="some srcSet"
        />,
      ]
    `)
  })
})

describe(`matchesMedia()`, () => {
  const OLD_MATCH_MEDIA = window.matchMedia

  beforeEach(() => {
    window.matchMedia = jest.fn(media =>
      media === '(min-width: 1401px)'
        ? {
            matches: true,
          }
        : {
            matches: false,
          }
    )
  })

  afterEach(() => {
    window.matchMedia = OLD_MATCH_MEDIA
  })

  it(`should match media (min-width: 1401px)`, () => {
    const matched = matchesMedia({ media: '(min-width: 1401px)' })
    expect(matched).toBeTruthy()
  })

  it(`should not match media (min-width: 491px)`, () => {
    const matched = matchesMedia({ media: '(min-width: 491px)' })
    expect(matched).toBeFalsy()
  })
})
