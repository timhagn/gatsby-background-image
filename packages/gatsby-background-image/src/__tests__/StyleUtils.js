import '@babel/polyfill'
import {
  createPseudoStyles,
  fixOpacity,
  presetBackgroundStyles,
  vendorPrefixBackgroundStyles,
  kebabifyBackgroundStyles,
} from '../StyleUtils'

global.console.debug = jest.fn()


describe(`fixOpacity()`, () => {
  it(`should return fixedOpacityProps for style prop with text content`, () => {
    const styledPropsWithText = {
      style: {
        opacity: `inherit`,
      }
    }
    const fixedOpacityProps = fixOpacity(styledPropsWithText)
    expect(fixedOpacityProps.style.opacity).toEqual(.99)
  })

  it(`should return fixedOpacityProps for style prop with opacity of 1`, () => {
    const styledPropsOpaqueOpacity = {
      style: {
        opacity: 1,
      }
    }
    const fixedOpacityProps = fixOpacity(styledPropsOpaqueOpacity)
    expect(fixedOpacityProps.style.opacity).toEqual(.99)
  })

  it(`shouldn't change opacityProps for style prop with opacity < .99`, () => {
    const styledPropsSmallOpacity = {
      style: {
        opacity: .5,
      }
    }
    const opacityProps = fixOpacity(styledPropsSmallOpacity)
    expect(opacityProps.style.opacity).toEqual(.5)
  })

  it(`should't change opacityProps for style prop without opacity`, () => {
    const styledPropsNoOpacity = {
      style: {}
    }
    const fixedOpacityProps = fixOpacity(styledPropsNoOpacity)
    expect(fixedOpacityProps.style.opacity).toBeUndefined()
  })
})


describe(`vendorPrefixBackgroundStyles()`, () => {
  it(`should return vendor prefixed backgroundStyles with defaults`, () => {
    expect(vendorPrefixBackgroundStyles()).toMatchSnapshot()/*.toEqual(
`-webkit-background-size: cover;
-moz-background-size: cover;
-o-background-size: cover;
-ms-background-size: cover;
background-size: cover;
-webkit-transition-delay: 0.25s;
-moz-transition-delay: 0.25s;
-o-transition-delay: 0.25s;
-ms-transition-delay: 0.25s;
transition-delay: 0.25s;
-webkit-transition: opacity 0.5s;
-moz-transition: opacity 0.5s;
-o-transition: opacity 0.5s;
-ms-transition: opacity 0.5s;
transition: opacity 0.5s;
`)*/
  })

  it(`should return vendor prefixed backgroundStyles with parameters`, () => {
    expect(vendorPrefixBackgroundStyles(`contain`, `0.5s`)).toMatchSnapshot()/*.toEqual(
`-webkit-background-size: contain;
-moz-background-size: contain;
-o-background-size: contain;
-ms-background-size: contain;
background-size: contain;
-webkit-transition-delay: 0.5s;
-moz-transition-delay: 0.5s;
-o-transition-delay: 0.5s;
-ms-transition-delay: 0.5s;
transition-delay: 0.5s;
-webkit-transition: opacity 0.5s;
-moz-transition: opacity 0.5s;
-o-transition: opacity 0.5s;
-ms-transition: opacity 0.5s;
transition: opacity 0.5s;
`)*/
  })
})


describe(`createPseudoStyles()`, () => {
let pseudoStyles = {}
beforeEach(() => {
  pseudoStyles = {
    classId: `gbi`,
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


describe(`kebabifyBackgroundStyles()`, () => {
  it(`should return string for style props with text content`, () => {
    const someStyles = `background-position: 'center';`

    const backgroundStyles = kebabifyBackgroundStyles(someStyles)
    expect(backgroundStyles).toEqual(someStyles)
  })
})