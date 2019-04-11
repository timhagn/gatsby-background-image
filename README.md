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
  <a href="https://www.npmjs.org/package/gatsby-background-image">
    <img src="https://img.shields.io/npm/v/gatsby-background-image.svg" alt="Current npm package version." />
  </a>
  <a href="https://npmcharts.com/compare/gatsby-background-image?minimal=true">
    <img src="https://img.shields.io/npm/dw/gatsby-background-image.svg" alt="Downloads per week on npm." />
  </a>
</p>

`gatsby-background-image` is a React component which for background-images
provides,  
what Gatsby's own `gatsby-image` does for the rest of your images.  
It started by pilfering their excellent work and adapting it - but slowly it's
outgrowing those wee beginnings.  

It has all the advantages of [gatsby-image](https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-image),
including the "blur-up" technique or  
a "[traced placeholder](https://github.com/gatsbyjs/gatsby/issues/2435)"
SVG to show a preview of the image while it loads,   
*plus* being usable as a container (no more hacks with extra wrappers).

All the glamour (and speed) of `gatsby-image` now for your Background Images!

___And it's even styleable with `styled-components` and the like!___   

## Example Repo

`gatsby-background-image` now has an example repository  
to see it's similarities & differences to `gatsby-image` side by side.  
It's located at: [gbitest](https://github.com/timhagn/gbitest)

## Procedure

As `gatsby-image` is designed to work seamlessly with Gatsby's native image
processing capabilities powered by GraphQL and Sharp, so is `gatsby-background-image`. 
To produce perfect background-images, you need only:

1. Import `gatsby-background-image` and use it in place of the built-in `div`
   or suchlike containers. 
2. Write a GraphQL query using one of the included GraphQL "fragments" which
   specify the fields  
   needed by `gatsby-background-image`.

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

Depending on the gatsby starter you used, you may need to include [gatsby-transformer-sharp](/packages/gatsby-transformer-sharp/) and [gatsby-plugin-sharp](/packages/gatsby-plugin-sharp/) as well, and make sure they are installed and included in your gatsby-config.

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

Also, make sure you have set up a source plugin, so your images are available in `graphql` queries. For example, if your images live in a project folder on the local filesystem, you would set up `gatsby-source-filesystem` in `gatsby-config.js` like so:

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

**Important:**

If you support *Safari* and/or *Internet Explorer*, you have to install several 
polyfills. Both need the `IntersectionObserver` polyfill, and IE also needs the 
`Object-fit/Object-position` one. As - at the time of writing - neither fully 
implements the former feature, and IE doesn't implement the latter.

A solution to this issue was mentioned in a comment over at [gatsby-image/issues](https://github.com/gatsbyjs/gatsby/issues/4021#issuecomment-445238511)  
(and an integration of their PR for it is planned, see [TODO](#todo))

## How to use

This is what a component using `gatsby-background-image` looks like:

```jsx
import React from 'react'
import { graphql, StaticQuery } from 'gatsby'
import styled from 'styled-components'

import BackgroundImage from 'gatsby-background-image'

const BackgroundSection = ({ className }) => (
    <StaticQuery query={graphql`
      query {
        desktop: file(relativePath: { eq: "seamless-bg-desktop.jpg" }) {
          childImageSharp {
            fluid(quality: 100, maxWidth: 4160) {
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
            <h1>Hello gatsby-background-image</h1>
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

## Configuration & props

`gatsby-background-image` nearly works the same as `gatsby-image` so have a look
at their [options & props](https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-image#two-types-of-responsive-images)
to get started.

## Styling & passed through styles

You may style your `gatsby-background-image` BackgroundImage-component every way
you like, be it CSS-Modules or even with `styled-components` or your CSS-in-JS 
"framework" of choice. The `style={{}}` prop is supported as well.

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

#### Deprecated styling

Though now considered deprecated and to be removed in `1.0.0` at the latest 
(feel free to open an issue, should you really need them : ),
`gatsby-background-image` has an added classId (as we had to name
pseudo-elements and introduce a className for the returned container
in the beginning):

| Name                   | Type                | Description                                                                             |
| ---------------------- | ------------------- | ----------------------------------------------------------------------------------------|
| `classId`              | `string`            | classID of the container element, defaults to a random lower case string of seven chars |

Only if present,  It works with CSS, too, you just have to target the 
BackgroundImage-component's class:

```css
.gatsby-background-image-[YOUR_ID]/*(:before, :after)*/ {
  background-repeat: repeat-y;
  background-position: bottom center;
  background-size: cover;
}
```

## props not available

As `gatsby-background-image` doesn't use placeholder-images, the following
props from `gatsby-image` are of course not available.

| Name                   | Type                | Old Usage                                                     |
| ---------------------- | ------------------- | --------------------------------------------------------------|
| `placeholderStyle`     | `object`            | Spread into the default styles of the placeholder img element |
| `placeholderClassName` | `string`            | A class that is passed to the placeholder img element         |
| `imgStyle`             | `object`            | Spread into the default styles of the actual img element

## Contributing

Everyone is more than welcome to contribute to this little package!   
So have a look at our [CONTRIBUTING](CONTRIBUTING.md) file and give it a go.
Thanks in advance!

## TODO
- integrate `gatsby-image/withIEPolyfill` [Gatsby PR #12681](https://github.com/gatsbyjs/gatsby/pull/12681)



