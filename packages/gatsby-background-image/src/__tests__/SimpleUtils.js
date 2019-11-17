import {
  combineArray,
  stringToArray,
  toCamelCase,
  toKebabCase,
} from '../lib/SimpleUtils'

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
      expect(toCamelCase(wordToConvert)).toEqual(expected[index])
    )
  })
})

describe(`toKebabCase()`, () => {
  it(`should convert various words to camelCase`, () => {
    const testWords = [
      `background`,
      `backgroundImage`,
      `objectPosition`,
      `WebkitTransitionDelay`,
      `GaRbL DIGOG`,
      `GaRbL    DIGOG    GIG`,
    ]
    const expected = [
      `background`,
      `background-image`,
      `object-position`,
      `-webkit-transition-delay`,
      `-ga-rb-l-d-i-g-o-g`,
      `-ga-rb-l-d-i-g-o-g-g-i-g`,
    ]
    testWords.forEach((wordToConvert, index) =>
      expect(toKebabCase(wordToConvert)).toEqual(expected[index])
    )
  })
})

describe(`stringToArray()`, () => {
  it(`should return array on array`, () => {
    const testConversion = stringToArray([])
    expect(testConversion instanceof Array).toBeTruthy()
  })
})

describe(`combineArray()`, () => {
  it(`should return combined Array`, () => {
    const fromArray = [`test`, `test`, ``, ``]
    const toArray = [``, ``, `test`, `test`]

    const testCombination = combineArray(fromArray, toArray)
    expect(testCombination instanceof Array).toBeTruthy()
    expect(testCombination).toMatchInlineSnapshot(`
      Array [
        "test",
        "test",
        "test",
        "test",
      ]
    `)
  })
})

describe(`combineArray()`, () => {
  it(`should return combined Array if fromArray isn't an Array`, () => {
    const fromArray = `test`
    const toArray = [``, ``, `test`, `test`]

    const testCombination = combineArray(fromArray, toArray)
    expect(testCombination instanceof Array).toBeTruthy()
    expect(testCombination).toMatchInlineSnapshot(`
      Array [
        "test",
      ]
    `)
  })
})
