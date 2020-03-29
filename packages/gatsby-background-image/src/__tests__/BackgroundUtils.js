import getBackgroundStyles, {
  getStyleRules,
  getStyleRulesForClassName,
} from '../lib/BackgroundUtils'

global.console.error = jest.fn()
global.console.debug = jest.fn()

/**
 * Creates a dummy class for getBackgroundStyles() to fetch.
 */
const createClass = () => {
  // Create the style class.
  const styleElement = document.createElement('style')
  styleElement.textContent = `
      .fixedImage {
        background-repeat: 'repeat-y';
      }
    `
  document.body.appendChild(styleElement)
  return styleElement
}

describe(`getBackgroundStyles()`, () => {
  it(`should parse background styles`, () => {
    createClass()
    const backgroundStyles = getBackgroundStyles(`fixedImage`)
    expect(backgroundStyles).toEqual({ 'background-repeat': "'repeat-y'" })
  })

  it(`should parse empty background styles`, () => {
    const backgroundStyles = getBackgroundStyles(``)
    expect(backgroundStyles).toEqual({})
  })
})

describe(`getStyleRules()`, () => {
  it(`should work with "CSSStyleDeclaration"`, () => {
    const mockStyleRules = [
      {
        style: {
          constructor: {
            name: 'CSSStyleDeclaration',
          },
        },
      },
    ]
    const styles = getStyleRules(mockStyleRules)
    expect(styles).toEqual(mockStyleRules[0].style)
  })

  it(`should work with "CSS2Properties"`, () => {
    const mockStyleRules = [
      {
        style: {
          background: '#000',
          'background-image': '',
          objectPosition: 'cover',
          constructor: {
            name: 'CSS2Properties',
          },
        },
      },
    ]
    const styles = getStyleRules(mockStyleRules)
    expect(styles).toEqual({})
  })

  it(`should fail for unknown style object prototype`, () => {
    const mockStyleRules = [
      {
        style: {
          constructor: {
            name: '',
          },
        },
      },
    ]
    getStyleRules(mockStyleRules)
    expect(global.console.error).toHaveBeenCalledWith(
      `Unknown style object prototype`
    )
  })

  it(`should fail for empty style object prototype`, () => {
    getStyleRules([])
    expect(global.console.error).toHaveBeenCalledWith(
      `Unknown style object prototype`
    )
  })
})

describe(`getStyleRulesForClassName()`, () => {
  beforeEach(() => {
    createClass()
  })

  it(`should return class for known classname via .cssRules`, () => {
    global.document.styleSheets[0].rules = undefined
    const styleRulesForClassName = getStyleRulesForClassName('.fixedImage')
    expect(styleRulesForClassName[0].selectorText).toEqual(`.fixedImage`)
    expect(styleRulesForClassName[0].style['background-repeat']).toEqual(
      `'repeat-y'`
    )
  })

  it(`should return class for known classname via self built .rules`, () => {
    global.document.styleSheets[0].rules = [
      {
        style: {
          cssText: `.fixedImage {background-repeat: repeat-y;}`,
        },
        selectorText: `.fixedImage`,
      },
    ]
    const styleRulesForClassName = getStyleRulesForClassName(`.fixedImage`)
    expect(styleRulesForClassName[0].selectorText).toEqual(`.fixedImage`)
    expect(styleRulesForClassName[0].style.cssText).toEqual(
      `.fixedImage {background-repeat: repeat-y;}`
    )
  })

  it(`should return class for known classname via .rules`, () => {
    global.document.styleSheets[0].cssRules = undefined
    global.document.styleSheets[0].rules = undefined
    const styleRulesForClassName = getStyleRulesForClassName(`.fixedImage`)
    expect(styleRulesForClassName[0].selectorText).toEqual(`.fixedImage`)
    expect(styleRulesForClassName[0].style.cssText).toEqual(
      `background-repeat: 'repeat-y';`
    )
  })
})

describe(`getStyleRulesForClassName() without window`, () => {
  const tmpWindow = global.window
  beforeEach(() => {
    delete global.window
  })
  afterEach(() => {
    global.window = tmpWindow
  })

  it(`should fail for window = undefined`, () => {
    const style = getStyleRulesForClassName('')
    expect(style).toEqual([])
  })
})
//
//   it(`should return class for known classname via .cssRules`, () => {
//     global.document.styleSheets[0].rules = undefined
//     const style = getStyle('.fixedImage')
//     expect(style).toEqual(`.fixedImage {background-repeat: 'repeat-y';}`)
//   })
//
//   it(`should return class for known classname via .rules`, () => {
//     global.document.styleSheets[0].cssRules = undefined
//     const style = getStyle('.fixedImage')
//     expect(style).toEqual(`.fixedImage {background-repeat: 'repeat-y';}`)
//   })
//
//   it(`should return class for known classname via self built .rules`, () => {
//     global.document.styleSheets[0].rules = [
//       {
//         style: {
//           cssText: `.fixedImage {background-repeat: 'repeat-y';}`,
//         },
//         selectorText: `.fixedImage`,
//       },
//     ]
//     const style = getStyle(`.fixedImage`)
//     expect(style).toEqual(`.fixedImage {background-repeat: 'repeat-y';}`)
//   })
//
//   it(`should build class for known classname via self built .rules`, () => {
//     global.document.styleSheets[0].rules = [
//       {
//         style: {
//           cssText: `background-repeat: 'repeat-y';`,
//         },
//         selectorText: `.fixedImage`,
//       },
//     ]
//     const style = getStyle(`.fixedImage`)
//     expect(style).toEqual(`.fixedImage{background-repeat: 'repeat-y';}`)
//   })
// })
// describe(`getStyle() without window`, () => {
//   const tmpWindow = global.window
//   beforeEach(() => {
//     delete global.window
//   })
//   afterEach(() => {
//     global.window = tmpWindow
//   })
//
//   it(`should fail for window = undefined`, () => {
//     const style = getStyle('')
//     expect(style).toEqual()
//   })
// })

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
