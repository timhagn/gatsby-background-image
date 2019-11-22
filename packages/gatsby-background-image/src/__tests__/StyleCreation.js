import {
  createNoScriptStyles,
  createPseudoElement,
  createPseudoElementMediaQuery,
  createPseudoElementWithContent,
  createPseudoStyles,
} from '../lib/StyleCreation'
import {
  fluidShapeMock,
  mockArtDirectionStackFluid,
} from './mocks/Various.mock'

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

describe(`createPseudoElementWithContent()`, () => {
  it(`should return string for style props with text content`, () => {
    const pseudoName = createPseudoElement('myclass')
    const pseudoElement = createPseudoElementWithContent(
      pseudoName,
      `url('testimage.jpg')`
    )
    expect(pseudoElement).toMatchInlineSnapshot(`
      "
          .myclass:before {
            opacity: 1;
            background-image: url('testimage.jpg');
          }"
    `)
  })
})

describe(`createPseudoElementMediaQuery()`, () => {
  it(`should return media queries with WebP`, () => {
    const pseudoName = createPseudoElement('myclass')
    const mediaQuery = createPseudoElementMediaQuery(
      pseudoName,
      `(mind-width: 500px)`,
      `url('testimage.jpg')`,
      `url('testimage.webp')`
    )
    expect(mediaQuery).toMatchInlineSnapshot(`
      "
            @media (mind-width: 500px) {
              
          .myclass:before {
            opacity: 1;
            background-image: url('testimage.jpg');
          }
            }
            @media (mind-width: 500px) {
                
          .myclass:before {
            opacity: 1;
            background-image: url('testimage.webp');
          }
              }
          "
    `)
  })
})

describe(`createNoScriptStyles()`, () => {
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

  it(`should return empty string for empty config object`, () => {
    expect(createNoScriptStyles({})).toEqual(``)
  })

  it(`should return media queries for art-directed images`, () => {
    const noScriptStyled = createNoScriptStyles({
      className: 'myclass',
      image: mockArtDirectionStackFluid,
    })
    expect(noScriptStyled).toMatchInlineSnapshot(`
      "
                  
          .myclass:before {
            opacity: 1;
            background-image: url(test_fluid_image.jpg);
          }
                  undefined
            @media (min-width: 491px) {
              
          .myclass:before {
            opacity: 1;
            background-image: url(test_fluid_image.jpg);
          }
            }
            
          
            @media (min-width: 1401px) {
              
          .myclass:before {
            opacity: 1;
            background-image: url(test_fluid_image.jpg);
          }
            }
            
          "
    `)
  })
  it(`should return media queries for art-directed images with WebP`, () => {
    const artDirectionMockWithWebP = [
      ...mockArtDirectionStackFluid,
      {
        ...fluidShapeMock,
        srcWebp: `testimage.webp`,
      },
    ]
    const noScriptStyled = createNoScriptStyles({
      className: 'myclass',
      image: artDirectionMockWithWebP,
    })
    expect(noScriptStyled).toMatchInlineSnapshot(`
      "
                  
          .myclass:before {
            opacity: 1;
            background-image: url(test_fluid_image.jpg);
          }
                  undefined
            @media (min-width: 491px) {
              
          .myclass:before {
            opacity: 1;
            background-image: url(test_fluid_image.jpg);
          }
            }
            
          
            @media (min-width: 1401px) {
              
          .myclass:before {
            opacity: 1;
            background-image: url(test_fluid_image.jpg);
          }
            }
            
          
                  
          .myclass:before {
            opacity: 1;
            background-image: url(test_fluid_image.jpg);
          }
                  @media screen {
                  
          .myclass:before {
            opacity: 1;
            background-image: url(testimage.webp);
          }
                }"
    `)
  })
})
