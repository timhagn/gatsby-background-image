<h1 align="center">
  gatsby-background-image
</h1>
<p align="center">
  <i>Speedy, optimized <strong>background</strong>-images without the work!</i>
</p>
<p align="center">
  <a href="https://github.com/timhagn/gatsby-background-image/blob/master/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="gatsby-background-image is released under the MIT license." />
  </a>
  <a href="https://circleci.com/gh/timhagn/gatsby-background-image">
    <img src="https://circleci.com/gh/timhagn/gatsby-background-image.svg?style=shield" alt="Current CircleCI build status of gatsby-background-image." />
  </a>
  <a href="https://codecov.io/gh/timhagn/gatsby-background-image">
    <img src="https://codecov.io/gh/timhagn/gatsby-background-image/branch/master/graph/badge.svg" />
  </a>
  <a href="https://www.npmjs.org/package/gatsby-background-image">
    <img src="https://img.shields.io/npm/v/gatsby-background-image.svg" alt="Current npm package version." />
  </a>
  <a href="https://npmcharts.com/compare/gatsby-background-image?minimal=true">
    <img src="https://img.shields.io/npm/dw/gatsby-background-image.svg" alt="Downloads per week on npm." />
  </a>
</p>

`gatsby-background-image` is a React component which for background-images
provides, what Gatsby's own `gatsby-image` does for the rest of your images and
even more:  
**[Testing explained](#testing-gatsby-background-image) in its own section.**
**[Art-Direction support](#how-to-use-with-art-direction-support) built in.**


It has all the advantages of [gatsby-image](https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-image),
including the "blur-up" technique or a "[traced placeholder](https://github.com/gatsbyjs/gatsby/issues/2435)"
SVG to show a preview of the image while it loads,  
**plus** being usable as a container (no more hacks with extra wrappers)  
**plus** being able to work with [multiple stacked background images](#how-to-use-with-multiple-images)  
**plus** being able to style with [Tailwind CSS and suchlike Frameworks](#tailwind-css-and-suchlike-frameworks)

All the glamour (and speed) of `gatsby-image` for your Background Images!

_*Of course styleable with `styled-components` and the like!*_

## ES5 Version

`gatsby-background-image` has a companion package completely transpiled to
ES5: [`gatsby-background-image-es5`](https://www.npmjs.com/package/gatsby-background-image-es5).  
Have a look at its [README](https://github.com/timhagn/gatsby-background-image/blob/master/packages/gatsby-background-image-es5/README.md),
it nearly works the same - though with ([nearly](#important)) all polyfills
included to support legacy browsers it's nearly three times the size of
this package.

## Table of Contents

- [Example Repo](#example-repo)
- [Procedure](#procedure)
- [Install](#install)
  - [Tailwind CSS and suchlike Frameworks](#tailwind-css-and-suchlike-frameworks)
  - [Important](#important)
- [How to Use](#how-to-use)
- [How to Use with Multiple Images](#how-to-use-with-multiple-images)
- [How to Use with Art-Direction support](#how-to-use-with-art-direction-support)
- [Configuration & props](#configuration--props)
- [Styling & Passed Through Styles](#styling--passed-through-styles)
  - [Passed Props for styled-components and suchlike](#passed-props-for-styled-components-and-suchlike)
  - [Overflow setting](#overflow-setting)
  - [Noscript styling](#noscript-styling)
  - [Responsive styling](#responsive-styling)
  - [Multiple Instances Of Same Component](#multiple-instances-of-same-component)
- [Additional props](#additional-props)
- [Changed props](#changed-props)
- [props Not Available](#props-not-available)
- [Handling of Remaining props](#handling-of-remaining-props)
- [Testing `gatsby-background-image`](#testing-gatsby-background-image)
- [Contributing](#contributing)
- [TODO](#todo)
- [Acknowledgements](#acknowledgements)

## Example Repo

`gatsby-background-image` has an example repository to see it's similarities & 
differences to `gatsby-image` side by side.  
It's located at: [gbitest](https://github.com/timhagn/gbitest)

## Procedure

As `gatsby-image` is designed to work seamlessly with Gatsby's native image
processing capabilities powered by GraphQL and Sharp, so is `gatsby-background-image`.
To produce optimized background-images, you need only to:

1. Import `gatsby-background-image` and use it in place of the built-in `div`
   or suchlike containers.
2. Write a GraphQL query using one of the GraphQL "fragments" provided by
   `gatsby-transformer-sharp`  
   which specify the fields needed by `gatsby-background-image`.

The GraphQL query creates multiple thumbnails with optimized JPEG and PNG
compression (or even WebP files for browsers that support them).
The `gatsby-background-image` component automatically sets up the
"blur-up" effect as well as lazy loading of images further down the screen.

## Install

To add `gatsby-background-image` as a dependency to your Gatsby-project use

```bash
npm install --save gatsby-background-image
```

or

```bash
yarn add gatsby-background-image
```

Depending on the gatsby starter you used, you may need to include [gatsby-transformer-sharp](https://github.com/gatsbyjs/gatsby/blob/master/packages/gatsby-transformer-sharp/)
and [gatsby-plugin-sharp](https://github.com/gatsbyjs/gatsby/blob/master/packages/gatsby-plugin-sharp/) as well, and make sure they are installed and included in your gatsby-config.

```bash
npm install --save gatsby-transformer-sharp gatsby-plugin-sharp
```

or

```bash
yarn add gatsby-transformer-sharp gatsby-plugin-sharp
```

Then in your `gatsby-config.js`:

```js
plugins: [`gatsby-transformer-sharp`, `gatsby-plugin-sharp`]
```

Also, make sure you have set up a source plugin, so your images are available in
`graphql` queries. For example, if your images live in a project folder on the
local filesystem, you would set up `gatsby-source-filesystem` in
`gatsby-config.js` like so:

```js
const path = require(`path`)

module.exports = {
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: path.join(__dirname, `src`, `images`),
      },
    },
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
  ],
}
```

#### Tailwind CSS and suchlike Frameworks

With `gatsby-background-image(-es5)` @ `v0.8.8` it's now possible to use
Tailwind CSS classes like `md:w-1/2` to style `BackgroundImage`.
Therefore a `specialChars` plugin option has been introduced to be able to
properly escape such classes, which defaults to `:/` but may be set to other
characters in `gatsby-config.js` like the following:

```js
module.exports = {
  plugins: [
    ...
    {
      resolve: 'gatsby-background-image-es5',
      options: {
        // add your own characters to escape, replacing the default ':/'
        specialChars: '/:',
      },
    },
    ...
   ],
};
```

#### Important:

If you support _Safari_ (older versions) and/or _Internet Explorer_, you have to
install the `IntersectionObserver` polyfill.  
As - at the time of writing - neither fully implements the feature
(see [caniuse.com](https://caniuse.com/#search=IntersectionObserver)).

A solution to this issue was mentioned in a comment over at [gatsby-image/issues](https://github.com/gatsbyjs/gatsby/issues/4021#issuecomment-445238511)  
and you are able to apply it the following way:

**1.** Install the [`intersection-observer`](https://www.npmjs.com/package/intersection-observer)
polyfill package by running:

```bash
npm i --save intersection-observer
```

or

```bash
yarn add intersection-observer
```

**2.** Dynamically load the polyfill in your `gatsby-browser.js`:

```js
// ES5 way
// exports.onClientEntry = () => {
// ES6 way
export const onClientEntry = () => {
  // IntersectionObserver polyfill for gatsby-background-image (Safari, IE)
  if (!(`IntersectionObserver` in window)) {
    import(`intersection-observer`)
    console.log(`# IntersectionObserver is polyfilled!`)
  }
}
```

## How to Use

Be sure to play around with the [Example Repo](#example-repo), as it shows
a few more flavors of using `BackgroundImage`, e.g. encapsulating it in a 
component : )!

This is what a component using `gatsby-background-image` might look like:

```js
import React from 'react'
import { graphql, StaticQuery } from 'gatsby'
import styled from 'styled-components'

import BackgroundImage from 'gatsby-background-image'

const BackgroundSection = ({ className }) => (
  <StaticQuery
    query={graphql`
      query {
        desktop: file(relativePath: { eq: "seamless-bg-desktop.jpg" }) {
          childImageSharp {
            fluid(quality: 90, maxWidth: 1920) {
              ...GatsbyImageSharpFluid_withWebp
            }
          }
        }
      }
    `}
    render={data => {
      // Set ImageData.
      const imageData = data.desktop.childImageSharp.fluid
      return (
        <BackgroundImage
          Tag="section"
          className={className}
          fluid={imageData}
          backgroundColor={`#040e18`}
        >
          <h2>gatsby-background-image</h2>
        </BackgroundImage>
      )
    }}
  />
)

const StyledBackgroundSection = styled(BackgroundSection)`
  width: 100%;
  background-position: bottom center;
  background-repeat: repeat-y;
  background-size: cover;
`

export default StyledBackgroundSection
```

## How to Use with Multiple Images

As `gatsby-background-image` may be used with [multiple backgrounds](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Backgrounds_and_Borders/Using_multiple_backgrounds),
**including CSS strings** like `rgba()` or suchlike this is what a component
using it might look like:

```js
import { graphql, useStaticQuery } from 'gatsby'
import React from 'react'
import styled from 'styled-components'

import BackgroundImage from 'gatsby-background-image'

const MultiBackground = ({ className }) => {
  const {
    astronaut,
    seamlessBackground,
  } = useStaticQuery(
    graphql`
      query {
        astronaut: file(relativePath: { eq: "astronaut.png" }) {
          childImageSharp {
            fluid(quality: 100) {
              ...GatsbyImageSharpFluid_withWebp
            }
          }
        }
        seamlessBackground: file(
          relativePath: { eq: "seamless-background.jpg" }
        ) {
          childImageSharp {
            fluid(quality: 100, maxWidth: 420) {
              ...GatsbyImageSharpFluid_withWebp
            }
          }
        }
      }
    `
  )

  // Watch out for CSS's stacking order, especially when styling the individual
  // positions! The lowermost image comes last!
  const backgroundFluidImageStack = [
    seamlessBackground.childImageSharp.fluid,
    `linear-gradient(rgba(220, 15, 15, 0.73), rgba(4, 243, 67, 0.73))`
    astronaut.childImageSharp.fluid,
  ].reverse()

  return (
    <BackgroundImage
      Tag={`section`}
      id={`test`}
      className={className}
      fluid={backgroundFluidImageStack}
    >
      <StyledInnerWrapper>
        <h2>
          This is a test of multiple background images.
        </h2>
      </StyledInnerWrapper>
    </BackgroundImage>
  )
}

const StyledInnerWrapper = styled.div`
  margin-top: 10%;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const StyledMultiBackground = styled(MultiBackground)`
  width: 100%;
  min-height: 100vh;
  /* You should set a background-size as the default value is "cover"! */
  background-size: auto;
  /* So we won't have the default "lightgray" background-color. */
  background-color: transparent;
  /* Now again, remember the stacking order of CSS: lowermost comes last! */
  background-repeat: no-repeat, no-repeat, repeat;
  background-position: center 155%, center, center;
  color: #fff;
`

export default StyledMultiBackground

```

## How to Use with Art-Direction support

`gatsby-background-image` supports showing different images at different 
breakpoints, which is known as [art direction](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images#Art_direction). 
To do this, you can define your own array of `fixed` or `fluid` images, along 
with a `media` key per image, and pass it to `gatsby-image`'s `fixed` or `fluid` 
props. The `media` key that is set on an image can be any valid CSS media query.

**_Attention:_ Currently you have to choose between Art-directed and Multiple-Images!** 

```js
import { graphql, useStaticQuery } from 'gatsby'
import React from 'react'
import styled from 'styled-components'

import BackgroundImage from 'gatsby-background-image'

const ArtDirectedBackground = ({ className }) => {
  const { mobileImage, desktopImage } = useStaticQuery(
    graphql`
      query {
        mobileImage: file(relativePath: { eq: "490x352.jpg" }) {
          childImageSharp {
            fluid(maxWidth: 490, quality: 100) {
              ...GatsbyImageSharpFluid_withWebp
            }
          }
        }
        desktopImage: file(relativePath: { eq: "tree.jpg" }) {
          childImageSharp {
            fluid(quality: 100, maxWidth: 4160) {
              ...GatsbyImageSharpFluid_withWebp
            }
          }
        }
      }  
    `
  )
  // Set up the array of image data and `media` keys.
  // You can have as many entries as you'd like.
  const sources = [
    mobileImage.childImageSharp.fluid,
    {
      ...desktopImage.childImageSharp.fluid,
      media: `(min-width: 491px)`,
    },
  ]

  return (
    <BackgroundImage
      Tag={`section`}
      id={`media-test`}
      className={className}
      fluid={sources}
    >
      <StyledInnerWrapper>
        <h2>Hello art-directed gatsby-background-image.</h2>
      </StyledInnerWrapper>
    </BackgroundImage>
  )
}

const StyledInnerWrapper = styled.div`
  margin-top: 10%;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const StyledArtDirectedBackground = styled(ArtDirectedBackground)`
  width: 100%;
  min-height: 100vh;
  /* You should set a background-size as the default value is "cover"! */
  background-size: auto;
  /* So we won't have the default "lightgray" background-color. */
  background-color: transparent;
`

export default StyledArtDirectedBackground
```

While you could achieve a similar effect with plain CSS media queries, 
`gatsby-background-image` accomplishes this using an internal `HTMLPictureElement`, 
as well as `window.matchMedia()`, which ensures that browsers only download 
the image they need for a given breakpoint while preventing 
[gatsby-image issue #15189](https://github.com/gatsbyjs/gatsby/issues/15189).

## Configuration & props

`gatsby-background-image` nearly works the same as `gatsby-image` so have a look
at their [options & props](https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-image#two-types-of-responsive-images)
to get started.  
But be sure to also throw a glance at [Additional props](#additional-props),
[Changed props](#changed-props), [props Not Available](#props-not-available) and
[Handling of Remaining props](#handling-of-remaining-props) as well ; )!

## Styling & Passed Through Styles

You may style your `gatsby-background-image` BackgroundImage-component every way
you like, be it global CSS, CSS-Modules or even with `styled-components` or your
CSS-in-JS "framework" of choice. The `style={{}}` prop is supported as well.

Whichever way you choose, _every_ `background-*` style declared in the main
class (or the `style={{}}` prop) will directly get passed through to the
pseudo-elements as well (so you would have no need for specifically styling them)!

The specificity hereby is in ascending order:

- class-styles
- extracted `background-*` styles
- `style={{}}` prop

The three `background-` styles seen above are necessary and will default to:

| Name                  | Default Value |
| --------------------- | ------------- |
| `background-position` | `center`      |
| `background-repeat`   | `no-repeat`   |
| `background-size`     | `cover`       |

To be able to overwrite them for each pseudo-element individually, you may reset
their values in the `style={{}}` prop with an empty string like such:

```
style={{
  // Defaults are overwrite-able by setting one or each of the following:
  backgroundSize: '',
  backgroundPosition: '',
  backgroundRepeat: '',
}}
```

_**¡But be sure to target the `:before` and `:after` pseudo-elements in your CSS,
lest your "blurred-up", traced placeholder SVG or lazy loaded background images
might jump around!**_

#### Passed Props for styled-components and suchlike

Perhaps you want to change the style of a `BackgroundImage` by passing a prop to
`styled-components` or suchlike CSS-in-JS libraries like e.g. the following:

```js
// isDarken gets changed in the parent component.
const StyledBackground = styled(BackgroundImage)`
  &::before,
  &::after {
    filter: invert(
      ${({ isDarken }) => {
        return isDarken ? '80%' : '0%'
      }}
    );
  }
`
```

But be aware that there happens no `state` change inside the `BackgroundImage`,
so React won't rerender it. This can easily be achieved, by settings an
additional `key` prop, which changes as well as the prop like thus:

```js
return <StyledBackgound isDarken={isDarken} key={isDarken ? `dark` : `light`} />
```

#### Overflow setting

As of `gatsby-background-image(-es5)` @ `v0.8.3` the superfluous default of
`overflow: hidden` was removed, as it was only a remnant from the initial
creation of `gbi` (see [Acknowledgements](#acknowledgements) for more on it's
meagre beginnings ; ). As later seen through [issue #59](https://github.com/timhagn/gatsby-background-image/issues/59),
this might break some CSS styling like `border-radius`, so be sure to include it
yourself, should you need such styles. Sorry for the inconvenience % )!

#### Noscript Styling

As using multiple background images broke with JavaScript disabled, with `v0.8.0`
we switched to an added `<style />` element.  
Sadly, in build mode or of course with JS disabled there's no `document` with
which to parse the background-styles from given `className`s and pass them down
to the `:before` and `:after` pseudo-elements.  
So, for the moment, to get your `<BackgroundImage />` to look the same with or
without JS, you have to either set their styles with the `style={{}}` prop or
explicitly target the `:before` and `:after` pseudo-elements in your CSS.

#### Responsive Styling

Using responsive styles on background images is supported in most cases, except when
passthrough is required. This is typically encountered when trying to make
`background-*` rules apply to the background image as in
[issue #71.](https://github.com/timhagn/gatsby-background-image/issues/71)
In this case, the background styling will not behave responsively. This is difficult
to fix because it is impossible to determine the `@media` rules that apply to an element.
However, a suitable workaround is available. For example, if your style looks like this:

```css
#mybg {
  background-attachment: fixed;
}
@media screen and (max-width: 600px) {
  #mybg {
    background-attachment: scroll;
  }
}
```

The `::before` and `::after` pseudo elements can be targeted directly to make your
style look like this:

```css
#mybg,
#mybg::before,
#mybg::after {
  background-attachment: fixed;
}

@media screen and (max-width: 600px) {
  #mybg,
  #mybg::before,
  #mybg::after {
    background-attachment: scroll;
  }
}
```

For more information, refer to [issue #71.](https://github.com/timhagn/gatsby-background-image/issues/71)

#### Multiple Instances of Same Component

Should you decide to use a single instance of a styled `<BackgroundImage />` for
multiple different images, it will automatically add an additional `className`,
a hashed 32bit integer of the current `srcSet` or `className` prefixed with `gbi-`,
to prevent erroneous styling of individual instances.  
You wouldn't have added the same class for different CSS `background-image`
styles on your own, or would you have ; )?

**Be warned**: Styling the components `:before` & `:after` pseudo-elements
within the main classes then only is going to work again for all instances if
you use `!important` on its CSS-properties (cause of CSS-specifity).

## Additional props

Starting with `v0.7.5` an extra option is available preserving the
[CSS stacking context](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context)
by deactivating the "opacity hack (`opacity: 0.99;`)" used on `<BackgroundImage />`
to allow it's usage within stacking context changing element styled with e.g.
`grid` or `flex` per default.  
Activating `preserveStackingContext` prevents this behavior - but allows you to
use any stacking context changing elements (like elements styled with
`position: fixed;`) yourself as `children`.

Starting with `v0.8.19` it's possible to change the IntersectionObservers'
`rootMargin` with a prop of the same name.

| Name                      | Type      | Description                                                                                 |
| ------------------------- | --------- | ------------------------------------------------------------------------------------------- |
| `preserveStackingContext` | `boolean` | Deactivates the "opacity hack" on `<BackgroundImage />` when set to true (Default: `false`) |
| `rootMargin`              | `string`  | Changes the IntersectionObserver `rootMargin`. (Default: `200px`)                           |

## Changed props

The `fluid` or `fixed` props may be given as an array of images returned from 
`fluid` or `fixed` queries or CSS Strings like `rgba()` or such.

The `fadeIn` prop may be set to `soft` to ignore cached images and always
try to fade in if `critical` isn't set.

| Name     | Type               | Description                                                                      |
| -------- | ------------------ | -------------------------------------------------------------------------------- |
| `fixed`  | `object`/`array`   | Data returned from one fixed query or an array of multiple ones or CSS string(s) |
| `fluid`  | `object`/`array`   | Data returned from one fluid query or an array of multiple ones or CSS string(s) |
| `fadeIn` | `boolean`/`string` | Defaults to fading in the image on load, may be forced by `soft`                 |

## props Not Available

As `gatsby-background-image` doesn't use placeholder-images, the following
props from `gatsby-image` are not available, of course.

| Name                   | Type     | Old Usage                                                     |
| ---------------------- | -------- | ------------------------------------------------------------- |
| `placeholderStyle`     | `object` | Spread into the default styles of the placeholder img element |
| `placeholderClassName` | `string` | A class that is passed to the placeholder img element         |
| `imgStyle`             | `object` | Spread into the default styles of the actual img element      |

From `gbi v1.0.0` on the even older `resolutions` & `sizes` props are removed 
as well - but don't confuse the latter with the possible `sizes` image prop in a 
`fluid` image, which of course is still handled. 

## Handling of Remaining props

After every available prop is handled, the remaining ones get cleaned up and
spread into the `<BackgroundImage />`'s container element.
This way you can "safely" add every ARIA or `data-*` attribute you might need
without having to use `gatsby-image`'s `itemProp` ; ).

## Testing `gatsby-background-image`

As `gbi` uses `short-uuid` to create its unique classes, you only have to mock 
`short-uuid`'s `generate()` function like explained below.

Either in your `jest.setup.js` or the top of your individual test file(s) mock 
the complete package:
`jest.mock('short-uuid')`

Then for each `gbi` component you want to test, add a `beforeEach()`:

```js
beforeEach(() => {
    // Freeze the generated className.
    const uuid = require('short-uuid')
    uuid.generate.mockImplementation(() => '73WakrfVbNJBaAmhQtEeDv')
});
```

Now the class name will always be the same and your snapshot tests should 
work : ).

## Contributing

Everyone is more than welcome to contribute to this little package!  
Docs, Reviews, Testing, Code - whatever you want to add, just go for it : ).
So have a look at our [CONTRIBUTING](https://github.com/timhagn/gatsby-background-image/blob/master/CONTRIBUTING.md) file and give it a go.
Thanks in advance!

## TODO

_For anything you may think necessary tell me by opening an issue or a PR : )!_

## Acknowledgements

This package started by pilfering `gatsby-image`s excellent work and adapting
it - but it's definitely outgrowing those wee beginnings.  
Thanks go to its creators & the @gatsbyjs Team, anyways : )!
