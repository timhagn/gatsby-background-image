import getBackgroundStyles, {
  getStyle,
  getStyleRules,
  rulesForCssText,
} from '../BackgroundUtils'
import 'react-testing-library/cleanup-after-each'

global.console.error = jest.fn()
global.console.debug = jest.fn()

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
  return styleElement
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

  it(`should fail for empty style object prototype`, () => {
    getStyleRules([])
    expect(global.console.error).toHaveBeenCalledWith(`Unknown style object prototype`)
  })
})


describe(`getStyle()`, () => {
  beforeEach(() => {
    createClass()
  })

  it(`should return class for known classname via .cssRules`, () => {
    global.document.styleSheets[0].rules = undefined
    const style = getStyle('.fixedImage')
    expect(style).toEqual(`.fixedImage {backgroundRepeat: 'repeat-y';}`)
  })

  it(`should return class for known classname via .rules`, () => {
    global.document.styleSheets[0].cssRules = undefined
    const style = getStyle('.fixedImage')
    expect(style).toEqual(`.fixedImage {backgroundRepeat: 'repeat-y';}`)
  })

  it(`should return class for known classname via self built .rules`, () => {
    global.document.styleSheets[0].rules = [
      {
        style: {
          cssText: `.fixedImage {backgroundRepeat: 'repeat-y';}`
        },
        selectorText: `.fixedImage`,
      },
    ]
    const style = getStyle(`.fixedImage`)
    expect(style).toEqual(`.fixedImage {backgroundRepeat: 'repeat-y';}`)
  })

  it(`should build class for known classname via self built .rules`, () => {
    global.document.styleSheets[0].rules = [
      {
        style: {
          cssText: `backgroundRepeat: 'repeat-y';`
        },
        selectorText: `.fixedImage`,
      },
    ]
    const style = getStyle(`.fixedImage`)
    expect(style).toEqual(`.fixedImage{backgroundRepeat: 'repeat-y';}`)
  })
})
describe(`getStyle() without window`, () => {
  const tmpWindow = global.window
  beforeEach(() => {
    delete global.window
  })
  afterEach(() => {
    global.window = tmpWindow
  })

  it(`should fail for window = undefined`, () => {
    const style = getStyle('')
    expect(style).toEqual()
  })
})

describe(`getBackgroundStyles() without window`, () => {
  const tmpWindow = global.window
  beforeEach(() => {
    delete global.window
  })
  afterEach(() => {
    global.window = tmpWindow
  })
  it(`should return empty object for window === 'undefined'`, () => {
    const backgroundStyles = getBackgroundStyles(``)
    expect(backgroundStyles).toEqual({})
  })
})