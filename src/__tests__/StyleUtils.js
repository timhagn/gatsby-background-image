import '@babel/polyfill'
import {
  createPseudoStyles,
  fixOpacity,
  vendorPrefixBackgroundStyles
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
    expect(vendorPrefixBackgroundStyles()).toEqual(
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
`)
  })

  it(`should return vendor prefixed backgroundStyles with parameters`, () => {
    expect(vendorPrefixBackgroundStyles(`contain`, `0.5s`)).toEqual(
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
`)
  })
})


describe(`createPseudoStyles()`, () => {
  const pseudoStyles = {
    classId: `gbi`,
    backgroundSize: `cover`,
    backgroundPosition: `center`,
    backgroundRepeat: `repeat-y`,
    transitionDelay: `0.25s`,
    bgImage: `test.webp`,
    nextImage: `test.webp`,
    afterOpacity: 1,
    bgColor: `#000`,
    noBase64: true,
  }
  it(`should create styles from given pseudoStyles Object`, () => {
    const createdPseudoStyles = createPseudoStyles(pseudoStyles)
    expect(createdPseudoStyles).toMatchSnapshot()
  })

  it(`should create different styles for different bgImage & nextImage`, () => {
    pseudoStyles.nextImage = `test.jpg`;
    const createdPseudoStyles = createPseudoStyles(pseudoStyles)
    expect(createdPseudoStyles).toMatchSnapshot()
  })
})