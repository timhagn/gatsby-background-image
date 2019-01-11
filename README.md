# gatsby-background-image

Speedy, optimized **background**-images without the work.

`gatsby-background-image` is a React component based on Gatsby's own `gatsby-image`
(truthfully, I pilfered most of their excellent work and adapted it ; ).

It has all the advantages of [gatsby-image](https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-image),
including the "blur-up" technique or  
a "[traced placeholder](https://github.com/gatsbyjs/gatsby/issues/2435)"
SVG to show a preview of the image while it loads,   
*plus* being usable as a container (no more hacks with extra wrappers).

All the glamour (and speed) of `gatsby-image` now for your Background Images!

___And it's even styleable with `styled-components` and the like!___   
(planned, media-queries: see [TODO](#todo))

# Procedure

As `gatsby-image` is designed to work seamlessly with Gatsby's native image
processing capabilities powered by GraphQL and Sharp, so is `gatsby-background-image`. 
To produce perfect background-images, you need only:

1. Import `gatsby-background-image` and use it in place of the built-in `div`
   or suchlike containers. 
2. Write a GraphQL query using one of the included GraphQL "fragments"
   which specify the fields needed by `gatsby-background-image`.

The GraphQL query creates multiple thumbnails with optimized JPEG and PNG
compression. The `gatsby-background-image` component automatically sets up the 
"blur-up" effect as well as lazy loading of images further down the screen.

## Install

`npm install --save gatsby-background-image`

Depending on the gatsby starter you used, you may need to include [gatsby-transformer-sharp](/packages/gatsby-transformer-sharp/) and [gatsby-plugin-sharp](/packages/gatsby-plugin-sharp/) as well, and make sure they are installed and included in your gatsby-config.

```bash
npm install --save gatsby-transformer-sharp gatsby-plugin-sharp
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
                           backgroundColor={BlueBackground}
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
  background-repeat: repeat-y;
`

export default StyledBackgroundSection

```

## Configuration & props

`gatsby-background-image` nearly works the same as `gatsby-image` so have a look
at their [options & props](https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-image#two-types-of-responsive-images)
to get started.

`gatsby-background-image` has an added classId (as we have to name
pseudo-elements and introduce a className for the returned container):

| Name                   | Type                | Description                                                                                                                 |
| ---------------------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `classId`              | `string`            | classID of the container element, defaults to a random lower case string of seven chars                                          |

Additionally, you are able to style your component with `styled-components` or
your CSS-in-JS "framework" of choice. It should work with CSS, too, you just
have to target the BackgroundImage-component's class:

```css
.gatsby-background-image-[YOUR_ID]/*(:before, :after)*/ {
   background-repeat: repeat-y;
}
```

## TODO

* add Media-Query support
* use Image() instead of `gatsby-image` placeholder images - look into `a11y`!

