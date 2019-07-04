<h1 align="center">
  gatsby-background-image-es5
</h1>
<p align="center">
  <i>Speedy, optimized <strong>background</strong>-images without the work!</i>
</p>
<p align="center">
  <a href="https://github.com/timhagn/gatsby-background-image/blob/master/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="gatsby-background-image-es5 is released under the MIT license." />
  </a>
  <a href="https://circleci.com/gh/timhagn/gatsby-background-image">
    <img src="https://circleci.com/gh/timhagn/gatsby-background-image.svg?style=shield" alt="Current CircleCI build status of gatsby-background-image." />
  </a>
  <a href="https://codecov.io/gh/timhagn/gatsby-background-image">
    <img src="https://codecov.io/gh/timhagn/gatsby-background-image/branch/master/graph/badge.svg" />
  </a>
  <a href="https://www.npmjs.org/package/gatsby-background-image-es5">
    <img src="https://img.shields.io/npm/v/gatsby-background-image-es5.svg" alt="Current npm package version." />
  </a>
</p>

`gatsby-background-image-es5` is a React component which for background-images
provides,  
what Gatsby's own `gatsby-image` does for the rest of your images.  

## Preamble

**This version is completely transpiled to ES5 to target older browsers like IE11!**
Most polyfills are already built in, though this nearly triples the package size
compared to [`gatsby-background-image`](https://www.npmjs.com/package/gatsby-background-image)!

Everything else just works the same as in `gatsby-background-image`, so this
package has all the advantages of [gatsby-image](https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-image),
including the "blur-up" technique or  
a "[traced placeholder](https://github.com/gatsbyjs/gatsby/issues/2435)"
SVG to show a preview of the image while it loads,   
**plus** being usable as a container (no more hacks with extra wrappers),  
**plus** being able to work with [multiple stacked background images](#how-to-use-with-multiple-images). 

All the glamour (and speed) of `gatsby-image` now for your Background Images!

___And it's even styleable with `styled-components` and the like!___   

## Table of Contents
- [Example Repo](#example-repo) 
- [Procedure](#procedure) 
- [Install](#install)
    * [Important](#important)
- [How to Use](#how-to-use)
- [How to Use with Multiple Images](#how-to-use-with-multiple-images)
- [Configuration & props](#configuration--props)
- [Styling & Passed Through Styles](#styling--passed-through-styles)
    * [Noscript styling](#noscript-styling)
    * [Multiple Instances Of Same Component](#multiple-instances-of-same-component)
    * [Deprecated Styling](#deprecated-styling)
- [Additional props](#additional-props)
- [Changed props](#changed-props)
- [props Not Available](#props-not-available)
- [Handling of Remaining props](#handling-of-remaining-props) 
- [Contributing](#contributing)
- [TODO](#todo)

## Example Repo

`gatsby-background-image` has an example repository to see it's similarities 
& differences to `gatsby-image` side by side.  
It's located at: [gbitest](https://github.com/timhagn/gbitest)
To use it with `gatsby-background-image-es5` change the dependency there.

## Procedure

As `gatsby-image` is designed to work seamlessly with Gatsby's native image
processing capabilities powered by GraphQL and Sharp, so is `gatsby-background-image-es5`. 
To produce optimized background-images, you need only to:

1. Import `gatsby-background-image-es5` and use it in place of the built-in `div`
   or suchlike containers. 
2. Write a GraphQL query using one of the GraphQL "fragments" provided by 
   `gatsby-transformer-sharp`  
   which specify the fields needed by `gatsby-background-image-es5`.

The GraphQL query creates multiple thumbnails with optimized JPEG and PNG
compression (or even WebP files for browsers that support them).
The `gatsby-background-image-es5` component automatically sets up the 
"blur-up" effect as well as lazy loading of images further down the screen.

## Install

To add `gatsby-background-image-es5` as a dependency to your Gatsby-project use  

```bash
npm install --save gatsby-background-image-es5
```

or  

```bash
yarn add gatsby-background-image-es5
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

#### Important:

If you support *Safari* and/or *Internet Explorer*, you have to use the 
`IntersectionObserver` polyfill.   
As - at the time of writing - neither fully implements the feature 
(see [caniuse.com](https://caniuse.com/#search=IntersectionObserver)).

This is already the ES5 version of `gatsby-background-image`, so nothing easier
than that! Just add `gatsby-background-image-es5` as a plugin to your 
`gatsby-config.js` like this:

```js
plugins: [
  `gatsby-background-image-es5`,
]
```

And 

## How to Use

This is what a component using `gatsby-background-image-es5` might look like:

```jsx
import React from 'react'
import { graphql, StaticQuery } from 'gatsby'
import styled from 'styled-components'

import BackgroundImage from 'gatsby-background-image-es5'

const BackgroundSection = ({ className }) => (
    <StaticQuery query={graphql`
      query {
        desktop: file(relativePath: { eq: "seamless-bg-desktop.jpg" }) {
          childImageSharp {
            fluid(quality: 90, maxWidth: 4160) {
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
          <BackgroundImage Tag="section"
                           className={className}
                           fluid={imageData}
                           backgroundColor={`#040e18`}
          >
            <h1>Hello gatsby-background-image-es5</h1>
          </BackgroundImage>
       )
     }
     }
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

As `gatsby-background-image` may now be used with [multiple backgrounds](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Backgrounds_and_Borders/Using_multiple_backgrounds),
**including CSS strings** like `rgba()` or suchlike this is what a component 
using `gatsby-background-image-es5` might look like:

```jsx
import { graphql, useStaticQuery } from 'gatsby'
import React from 'react'
import styled from 'styled-components'

import BackgroundImage from 'gatsby-background-image-es5'

const MultiBackground = ({ children, className }) => {
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

  // Watch out for CSS's stacking order, especially when styling the
  // individual positions! The lowermost image comes last!
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
        <h1>
          This is a test of multiple background images.
        </h1>
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

## Configuration & props

`gatsby-background-image` nearly works the same as `gatsby-image` so have a look
at their [options & props](https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-image#two-types-of-responsive-images)
to get started. But be sure to also throw a glance at [Additional props](#additional-props), 
[Changed props](#changed-props), [props Not Available](#props-not-available) and 
[Handling of Remaining props](#handling-of-remaining-props) as well ; )!

## Styling & Passed Through Styles

You may style your `gatsby-background-image-es5` BackgroundImage-component every way
you like, be it global CSS, CSS-Modules or even with `styled-components` or your 
CSS-in-JS "framework" of choice. The `style={{}}` prop is supported as well.

Whichever way you choose, *every* `background-*` style declared in the main 
class (or the `style={{}}` prop) will directly get passed through to the 
pseudo-elements as well (so you would have no need for specifically styling them)!

The specificity hereby is in ascending order:
- class-styles
- extracted `background-*` styles 
- `style={{}}` prop

The three `background-` styles seen above are necessary and will default to:

| Name                   | Default Value          |    
| ---------------------- | ---------------------- |
| `background-position`  | `center`               | 
| `background-repeat`    | `no-repeat`            | 
| `background-size`      | `cover`                |

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

#### Noscript Styling

As using multiple background images broke with JavaScript disabled, with `v0.8.0`
we switched to an added `<style />` element.  
Sadly, in build mode or of course with JS disabled there's no `document` with
which to parse the background-styles from given `className`s and pass them down
to the `:before` and `:after` pseudo-elements.  
So, for the moment, to get your `<BackgroundImage />` to look the same with or
without JS, you have to either set their styles with the `style={{}}` prop or
explicitly target the `:before` and `:after` pseudo-elements in your CSS.  

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

#### Deprecated Styling

Though now considered deprecated and to be removed in `1.0.0` at the latest 
(feel free to open an issue, should you really need them : ),
`gatsby-background-image-es5` has an added classId (as we had to name
pseudo-elements and introduce a className for the returned container
in the beginning):

| Name                   | Type                | Description                                                                                                  |
| ---------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------ |
| `classId`              | `string`            | classID of the container element, defaults to a random lower case string of seven chars, followed by `_depr` |

Only if present now, pseudo-elements are created on a class by the name of 
`.gatsby-background-image-[YOUR_ID]` and the class is added to `BackgroundImage`.
Now you are able to access it through CSS / CSS-in-JS with:

```css
.gatsby-background-image-[YOUR_ID]/*(:before, :after)*/ {
  background-repeat: repeat-y;
  background-position: bottom center;
  background-size: cover;
}
```

But as the paragraph-title states: This behavior is considered deprecated, so
don't count on it in production ; ).

## Additional props

Starting with `v0.7.5` an extra option is available preserving the 
[CSS stacking context](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context)
by deactivating the "opacity hack (`opacity: 0.99;`)" used on `<BackgroundImage />` 
to allow it's usage within stacking context changing element styled with e.g. 
`grid` or `flex` per default.   
Activating `preserveStackingContext` prevents this behavior - but allows you to
use any stacking context changing elements (like elements styled with 
`position: fixed;`) yourself as `children`.

| Name                      | Type      | Description                                                                                |
| ------------------------- | ----------| ------------------------------------------------------------------------------------------ |
| `preserveStackingContext` | `boolean` | Deactivates the "opacity hack" on `<BackgroundImage />` when set to true (Default: `false`)|

## Changed props

The `fluid` or `fixed` (as well as the deprecated `resolutions` & `sizes`) props
may be given as an array of images returned from `fluid` or `fixed` queries or 
CSS Strings like `rgba()` or such. 

The `fadeIn` prop may be set to `soft` to ignore cached images and always
try to fade in if `critical` isn't set.

| Name                   | Type                  | Description                                                                     |
| ---------------------- | --------------------- | ------------------------------------------------------------------------------- |
| `fixed`            	 | `object`/`array`      | Data returned from one fixed query or an array of multiple ones or CSS string(s)|
| `fluid`            	 | `object`/`array`      | Data returned from one fluid query or an array of multiple ones or CSS string(s)|
| `fadeIn`               | `boolean`/`string`    | Defaults to fading in the image on load, may be forced by `soft`                |

## props Not Available

As `gatsby-background-image-es5` doesn't use placeholder-images, the following
props from `gatsby-image` are not available, of course.

| Name                   | Type                | Old Usage                                                     |
| ---------------------- | ------------------- | --------------------------------------------------------------|
| `placeholderStyle`     | `object`            | Spread into the default styles of the placeholder img element |
| `placeholderClassName` | `string`            | A class that is passed to the placeholder img element         |
| `imgStyle`             | `object`            | Spread into the default styles of the actual img element      |

## Handling of Remaining props

After every available prop is handled, the remaining ones get cleaned up and
spread into the `<BackgroundImage />`'s container element.
This way you can "safely" add every ARIA or `data-*` attribute you might need
without having to use `gatsby-image`'s `itemProp` ; ). 

## Contributing

Everyone is more than welcome to contribute to this little package!   
Docs, Reviews, Testing, Code - whatever you want to add, just go for it : ).
So have a look at our [CONTRIBUTING](https://github.com/timhagn/gatsby-background-image/blob/master/CONTRIBUTING.md) file and give it a go.
Thanks in advance!

## TODO

- Internet Explorer 11 seems to have problems with `_tracedSVG`...
- `noscript` WebP support...

*For anything else tell me by opening an issue or a PR : )!*