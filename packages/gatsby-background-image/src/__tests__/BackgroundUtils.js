import '@babel/polyfill'
import getBackgroundStyles, {
  getStyleRules,
  rulesForCssText,
  toCamelCase
} from '../BackgroundUtils'


global.console.error = jest.fn()


/**
 * Creates a dummy class for getBackgroundStyles() to fetch.
 */
const createClass = () => {
  // Create the style class.
  const styleElement = document.createElement("style")
  styleElement.textContent = `
      .fixedImage {
        backgroundRepeat: 'repeat-y';
      }
    `
  document.body.appendChild(styleElement)
}


describe(`getBackgroundStyles()`, () => {
  it(`should parse background styles`, () => {
    createClass()
    const backgroundStyles = getBackgroundStyles(`fixedImage`)
    expect(backgroundStyles).toEqual({ "backgroundRepeat": "'repeat-y'", })
  })

  it(`should parse empty background styles`, () => {
    const backgroundStyles = getBackgroundStyles(``)
    expect(backgroundStyles).toEqual({})
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
        expect(toCamelCase(wordToConvert)).toEqual(expected[index]))
  })
})


describe(`rulesForCssText()`, () => {
  it(`should get correct style from rule`, () => {
      const styleContent = `.fixedImage {
                              backgroundRepeat: 'repeat-y';
                            }`
      const rules = rulesForCssText(styleContent)
      expect(rules).toHaveLength(1)
      expect(rules[0]).toBeInstanceOf(CSSStyleRule)
  })

  it(`should return empty object for empty style rules`, () => {
    const emptyRules = rulesForCssText()
    expect(emptyRules).toEqual({})
  })
})


describe(`getStyleRules()`, () => {
  it(`should work with "CSSStyleDeclaration"`, () => {
    const mockStyleRules = [
      {
        style: {
          constructor: {
            name: 'CSSStyleDeclaration'
          }
        }
      }
    ]
    const styles = getStyleRules(mockStyleRules)
    expect(styles).toEqual(mockStyleRules[0].style)
  })

  it(`should work with "CSS2Properties"`, () => {
    const mockStyleRules = [
      {
        style: {
          'background': '#000',
          'background-image': '',
          objectPosition: 'cover',
          constructor: {
            name: 'CSS2Properties'
          },
        }
      }
    ]
    const styles = getStyleRules(mockStyleRules)
    expect(styles).toEqual({})
  })

  it(`should fail for unknown style object prototype`, () => {
    const mockStyleRules = [
      {
        style: {
          constructor: {
            name: ''
          }
        }
      }
    ]
    getStyleRules(mockStyleRules)
    expect(global.console.error).toHaveBeenCalledWith(`Unknown style object prototype`)
  })
})