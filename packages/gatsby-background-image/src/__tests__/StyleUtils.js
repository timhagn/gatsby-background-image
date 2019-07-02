import {
  createPseudoStyles,
  fixOpacity,
  presetBackgroundStyles,
  setTransitionStyles,
  kebabifyBackgroundStyles,
  fixClassName,
  activateCacheForComponentClass, createNoScriptStyles,
} from '../StyleUtils'
import { fluidShapeMock } from './mocks/Various.mock'
import { hashString } from '../HelperUtils'

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

describe(`createPseudoStyles()`, () => {
  let pseudoStyles = {}
  beforeEach(() => {
    pseudoStyles = {
      classId: `gbi`,
      className: `test`,
      backgroundSize: `cover`,
      backgroundPosition: `center`,
      backgroundRepeat: `repeat-y`,
      transitionDelay: `0.25s`,
      bgImage: `test.webp`,
      nextImage: `test.webp`,
      lastImage: `some_base64_string`,
      afterOpacity: 1,
      bgColor: `#000`,
      fadeIn: true,
    }
  })
  it(`should create styles from given pseudoStyles Object`, () => {
    const createdPseudoStyles = createPseudoStyles(pseudoStyles)
    expect(createdPseudoStyles).toMatchSnapshot()
  })

  it(`should create styles from given pseudoStyles Object without classId`, () => {
    delete pseudoStyles.classId
    const createdPseudoStyles = createPseudoStyles(pseudoStyles)
    expect(createdPseudoStyles).toMatchSnapshot()
  })

  it(`should create styles from given pseudoStyles Object without className`, () => {
    delete pseudoStyles.className
    const createdPseudoStyles = createPseudoStyles(pseudoStyles)
    expect(createdPseudoStyles).toMatchSnapshot()
  })

  it(`should create styles from given pseudoStyles Object without classId or className`, () => {
    delete pseudoStyles.classId
    delete pseudoStyles.className
    const createdPseudoStyles = createPseudoStyles(pseudoStyles)
    expect(createdPseudoStyles).toMatchSnapshot()
  })

  it(`should create styles from given pseudoStyles Object with opacity 0`, () => {
    pseudoStyles.afterOpacity = 0
    const createdPseudoStyles = createPseudoStyles(pseudoStyles)
    expect(createdPseudoStyles).toMatchSnapshot()
  })

  it(`should create styles from given pseudoStyles Object without fadeIn`, () => {
    pseudoStyles.fadeIn = false
    const createdPseudoStyles = createPseudoStyles(pseudoStyles)
    expect(createdPseudoStyles).toMatchSnapshot()
  })

  it(`should create different styles for empty nextImage`, () => {
    delete pseudoStyles.nextImage
    const createdPseudoStyles = createPseudoStyles(pseudoStyles)
    expect(createdPseudoStyles).toMatchSnapshot()
  })

  it(`should create different styles for empty bgImage`, () => {
    delete pseudoStyles.bgImage
    const createdPseudoStyles = createPseudoStyles(pseudoStyles)
    expect(createdPseudoStyles).toMatchSnapshot()
  })

  it(`should create different styles for empty nextImage with opacity 0`, () => {
    delete pseudoStyles.nextImage
    pseudoStyles.afterOpacity = 0
    const createdPseudoStyles = createPseudoStyles(pseudoStyles)
    expect(createdPseudoStyles).toMatchSnapshot()
  })

  it(`should create different styles for empty bgImage with opacity 0`, () => {
    delete pseudoStyles.bgImage
    pseudoStyles.afterOpacity = 0
    const createdPseudoStyles = createPseudoStyles(pseudoStyles)
    expect(createdPseudoStyles).toMatchSnapshot()
  })

  it(`should create different styles for empty lastImage with opacity 0`, () => {
    pseudoStyles.lastImage = ``
    pseudoStyles.afterOpacity = 0
    const createdPseudoStyles = createPseudoStyles(pseudoStyles)
    expect(createdPseudoStyles).toMatchSnapshot()
  })

  it(`should create different styles for empty bgImage & nextImage`, () => {
    delete pseudoStyles.bgImage
    delete pseudoStyles.nextImage
    const createdPseudoStyles = createPseudoStyles(pseudoStyles)
    expect(createdPseudoStyles).toMatchSnapshot()
  })

  it(`should create different styles for empty bgImage & nextImage with opacity 0`, () => {
    delete pseudoStyles.bgImage
    delete pseudoStyles.nextImage
    pseudoStyles.afterOpacity = 0
    const createdPseudoStyles = createPseudoStyles(pseudoStyles)
    expect(createdPseudoStyles).toMatchSnapshot()
  })
})

describe(`createNoScriptStyles()`, () => {
  it(`should return empty string for empty config object`, () => {
    expect(createNoScriptStyles({})).toEqual(``)
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

describe(`fixClassName()`, () => {
  it(`should return empty generated className props`, () => {
    const fixedClasses = fixClassName({})
    expect(fixedClasses).toMatchInlineSnapshot(`""`)
  })

  it(`should return generated className on existing class`, () => {
    activateCacheForComponentClass(`imageClass`)
    const fixedClasses = fixClassName({
      className: `imageClass`,
      fluid: fluidShapeMock,
    })
    expect(fixedClasses).toMatchInlineSnapshot(`"imageClass gbi-1393017994"`)
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
