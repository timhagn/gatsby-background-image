import {
  fixOpacity,
  presetBackgroundStyles,
  setTransitionStyles,
  kebabifyBackgroundStyles,
  fixClassName,
  escapeClassNames,
} from '../lib/StyleUtils'
import { fluidShapeMock } from './mocks/Various.mock'
import { activateCacheForComponentClass } from '../lib/ClassCache'

global.console.debug = jest.fn()

describe(`fixOpacity()`, () => {
  it(`should return fixedOpacityProps for style prop with text content`, () => {
    const styledPropsWithText = {
      style: {
        opacity: `inherit`,
      },
    }
    const fixedOpacityProps = fixOpacity(styledPropsWithText)
    expect(fixedOpacityProps.style.opacity).toEqual(0.99)
  })

  it(`should return fixedOpacityProps for style prop with opacity of 1`, () => {
    const styledPropsOpaqueOpacity = {
      style: {
        opacity: 1,
      },
    }
    const fixedOpacityProps = fixOpacity(styledPropsOpaqueOpacity)
    expect(fixedOpacityProps.style.opacity).toEqual(0.99)
  })

  it(`shouldn't change opacityProps for style prop with opacity < .99`, () => {
    const styledPropsSmallOpacity = {
      style: {
        opacity: 0.5,
      },
    }
    const opacityProps = fixOpacity(styledPropsSmallOpacity)
    expect(opacityProps.style.opacity).toEqual(0.5)
  })

  it(`should't change opacityProps for style prop without opacity`, () => {
    const styledPropsNoOpacity = {
      style: {},
    }
    const fixedOpacityProps = fixOpacity(styledPropsNoOpacity)
    expect(fixedOpacityProps.style.opacity).toBeUndefined()
  })
})

describe(`vendorPrefixBackgroundStyles()`, () => {
  it(`should return vendor prefixed backgroundStyles with defaults`, () => {
    expect(setTransitionStyles()).toMatchSnapshot()
  })

  it(`should return vendor prefixed backgroundStyles with parameters`, () => {
    expect(setTransitionStyles(`contain`, `0.5s`)).toMatchSnapshot()
  })
})

describe(`presetBackgroundStyles()`, () => {
  it(`should return defaultBackgroundStyles with empty backgroundStyles`, () => {
    const defaultBackgroundStyles = {
      backgroundPosition: `center`,
      backgroundRepeat: `no-repeat`,
      backgroundSize: `cover`,
    }

    const backgroundStyles = presetBackgroundStyles({})
    expect(backgroundStyles).toEqual(defaultBackgroundStyles)
  })
})

// jest.mock('short-uuid')
describe(`fixClassName()`, () => {
  beforeAll(() => {
    // Freeze StyleUtils#fixClassName.
    const uuid = require('short-uuid')
    uuid.generate.mockImplementation(() => '73WakrfVbNJBaAmhQtEeDv')
  })

  it(`should return empty generated className props`, () => {
    const fixedClasses = fixClassName({})
    expect(fixedClasses).toMatchInlineSnapshot(`
      Array [
        "gatsby-background-image-wrapper",
      ]
    `)
  })

  it(`should return generated className on class with uuid`, () => {
    activateCacheForComponentClass(`imageClass`)
    const [fixedClasses, addedClassName] = fixClassName({
      className: `imageClass`,
      fluid: fluidShapeMock,
    })
    expect(fixedClasses).toMatchInlineSnapshot(
      `"imageClass gbi-1393017994-73WakrfVbNJBaAmhQtEeDv"`
    )
    expect(addedClassName).toMatchInlineSnapshot(`undefined`)
  })

  it(`should return generated className on existing class`, () => {
    activateCacheForComponentClass(`imageClass`)
    const [fixedClasses, addedClassName] = fixClassName({
      className: `imageClass`,
      addedClassName: `imageClass`,
      fluid: fluidShapeMock,
    })
    expect(fixedClasses).toMatchInlineSnapshot(
      `"imageClass gbi-1393017994-73WakrfVbNJBaAmhQtEeDv"`
    )
    expect(addedClassName).toMatchInlineSnapshot(`undefined`)
  })
})

describe(`escapeClassNames()`, () => {
  it(`should return undefined for empty className`, () => {
    const escapedClasses = escapeClassNames()
    expect(escapedClasses).toMatchInlineSnapshot(`undefined`)
  })

  it(`should return escaped className for Tailwind Class`, () => {
    const escapedClasses = escapeClassNames(`md:w-1/2`)
    expect(escapedClasses).toMatchInlineSnapshot(`"md\\\\:w-1\\\\/2"`)
  })

  it(`should return default escaped className for Tailwind Class without __GBI_SPECIAL_CHARS__`, () => {
    const backupSpecialChars = __GBI_SPECIAL_CHARS__
    delete global.__GBI_SPECIAL_CHARS__
    const escapedClasses = escapeClassNames(`md:w-1/2`)
    expect(escapedClasses).toMatchInlineSnapshot(`"md\\\\:w-1\\\\/2"`)
    global.__GBI_SPECIAL_CHARS__ = backupSpecialChars
  })

  it(`should return escaped className for Tailwind Class with specialChars on window`, () => {
    window._gbiSpecialChars = __GBI_SPECIAL_CHARS__
    const escapedClasses = escapeClassNames(`md:w-1/2`)
    expect(escapedClasses).toMatchInlineSnapshot(`"md\\\\:w-1\\\\/2"`)
    delete window._gbiSpecialChars
  })
})

describe(`kebabifyBackgroundStyles()`, () => {
  it(`should return string for style props with text content`, () => {
    const someStyles = `background-position: 'center';`

    const backgroundStyles = kebabifyBackgroundStyles(someStyles)
    expect(backgroundStyles).toEqual(someStyles)
  })
  it(`should return empty string without style prop`, () => {
    const backgroundStyles = kebabifyBackgroundStyles()
    expect(backgroundStyles).toEqual(``)
  })
})
