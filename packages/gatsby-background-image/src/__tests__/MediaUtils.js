import {
  fixedShapeMock,
  fluidShapeMock,
  mockArtDirectionStackFixed,
  mockArtDirectionStackFluid,
} from './mocks/Various.mock'
import {
  createArtDirectionSources,
  groupByMedia,
  matchesMedia,
} from '../lib/MediaUtils'

global.console.warn = jest.fn()

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
    const twoWithoutMediaStack = [...mockArtDirectionStackFluid, fluidShapeMock]
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

  it(`should return an art-direction stack (fixed)`, () => {
    const testArtDirectionStack = createArtDirectionSources({
      fluid: mockArtDirectionStackFixed,
    })
    expect(testArtDirectionStack).toMatchInlineSnapshot(`
      Array [
        <source
          media="(min-width: 491px)"
          srcset="some srcSetWebp"
          type="image/webp"
        />,
        <source
          media="(min-width: 1401px)"
          srcset="some srcSetWebp"
          type="image/webp"
        />,
      ]
    `)
  })

  it(`should return an art-direction stack (fixed) also without srcSetWebp`, () => {
    const { srcSetWebp, ...testFixedMock } = fixedShapeMock
    const mockArtDirectionStackFixedDepleted = [
      testFixedMock,
      {
        ...testFixedMock,
        media: `(min-width: 491px)`,
      },
      {
        ...testFixedMock,
        media: `(min-width: 1401px)`,
      },
    ]
    const testArtDirectionStack = createArtDirectionSources({
      fixed: mockArtDirectionStackFixedDepleted,
    })
    expect(testArtDirectionStack).toMatchInlineSnapshot(`
      Array [
        <source
          media="(min-width: 491px)"
        />,
        <source
          media="(min-width: 1401px)"
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

  it(`should not match empty media`, () => {
    const matched = matchesMedia({})
    expect(matched).toBeFalsy()
  })
})
