<h1 align="center">
  g(atsby-background-)image-bridge
</h1>
<p align="center">
  <i>Bringing gatsby-background-image to Gatsby 3!</i>
</p>
<p align="center">
  <a href="https://github.com/timhagn/gatsby-background-image/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="gatsby-background-image-es5 is released under the MIT license." />
  </a>
  <a href="https://www.npmjs.org/package/gbimage-bridge">
    <img src="https://img.shields.io/npm/v/gbimage-bridge.svg" alt="Current npm package version." />
  </a>
  <a href="https://codecov.io/gh/timhagn/gatsby-background-image">
    <img src="https://codecov.io/gh/timhagn/gatsby-background-image/branch/main/graph/badge.svg" />
  </a>
</p>

`g(atsby-background-)image-bridge` bridges the gap between Gatsby 3+4's
`gatsby-plugin-image` syntax of providing images and the old
`fluid / fixed` syntax currently still used by
[`gatsby-background-image`](https://github.com/timhagn/gatsby-background-image)
& the now deprecated `gatsby-image`.

Don't know what I'm talking about? Head over to
[Migrating from gatsby-image to gatsby-plugin-image](https://www.gatsbyjs.com/docs/reference/release-notes/image-migration-guide/)
to see for yourself what changed in Gatsby 3 under the hood!

## Table of Contents

- [Install](#install)
- [How to Use](#how-to-use)
  - [convertToBgImage()](#converttobgimage)
- [Contributing](#contributing)

## Install

To add `gbimage-bridge` as a dependency to your Gatsby-project use

```bash
yarn add gbimage-bridge
```

or

```bash
npm install --save gbimage-bridge
```

You will need `gatsby-background-image` & have `gatsby-plugin-image` installed
as well. For `gatsby-background-image` installation instructions head over to
its [README](https://github.com/timhagn/gatsby-background-image/tree/main/packages/gatsby-background-image).
For installation instructions of `gatsby-plugin-image`, follow the
aforementioned [migration guide](https://www.gatsbyjs.com/docs/reference/release-notes/image-migration-guide/).


## Support for older browsers

If you want to use `gbimage-bridge` with `gatsby-background-image-es5` you have to install all three packages.
Additionally, make sure you have `core-js` as a dependency in your `package.json`.

```bash
yarn add gbimage-bridge gatsby-background-image gatsby-background-image-es5 core-js`
```

or 

```bash
npm install --save gbimage-bridge gatsby-background-image gatsby-background-image-es5 core-js`
```

Add `import core-js/stable` to the component using `gbimage-bridge` and Gatsby will automatically add
the needed polyfills.


## How to use

For your convenience this package exports a Wrapper around `BackgroundImage`,
that automatically converts the new image format to the old one needed by it.
All properties are passed through to `BackgroundImage` so use `BgImage` like a
drop in replacement for it.
Read below what happens inside, but here's the wrapper:

```jsx
import { graphql, useStaticQuery } from 'gatsby';
import { getImage } from 'gatsby-plugin-image';
import { BgImage } from 'gbimage-bridge';

const BridgeTest = () => {
  const { placeholderImage } = useStaticQuery(
          graphql`
      query {
        placeholderImage: file(relativePath: { eq: "gatsby-astronaut.png" }) {
          childImageSharp {
            gatsbyImageData(
              width: 200
              placeholder: BLURRED
              formats: [AUTO, WEBP, AVIF]
            )
          }
        }
      }
    `
  );
  const pluginImage = getImage(image);

  return (
          <BgImage image={pluginImage} style={{ minWidth: 200, minHeight: 200 }}>
            <div>Hello from BgImage!</div>
          </BgImage>
  );
};
```

It of course works with stacked images...

```jsx
import { graphql, useStaticQuery } from 'gatsby';
import { getImage } from 'gatsby-plugin-image';
import { BgImage } from 'gbimage-bridge';

const StackedBridgeTest = () => {
  const { placeholderImage } = useStaticQuery(
          graphql`
      query {
        placeholderImage: file(relativePath: { eq: "gatsby-astronaut.png" }) {
          childImageSharp {
            gatsbyImageData(
              width: 200
              placeholder: BLURRED
              formats: [AUTO, WEBP, AVIF]
            )
          }
        }
      }
    `
  );
  const pluginImage = getImage(image);

  // Watch out for CSS's stacking order, especially when styling the individual
  // positions! The lowermost image comes last!
  const backgroundFluidImageStack = [
    `linear-gradient(rgba(220, 15, 15, 0.73), rgba(4, 243, 67, 0.73))`,
    pluginImage,
  ].reverse();

  return (
          <BgImage image={backgroundFluidImageStack} style={{ minWidth: 200, minHeight: 200 }}>
            <div>Hello from BgImage!</div>
          </BgImage>
  );
};
```

... and art-directed ones as well : )!

```jsx
import { graphql, useStaticQuery } from 'gatsby';
import { getImage } from 'gatsby-plugin-image';
import { BgImage } from 'gbimage-bridge';

const ArtDirectedBridgeTest = () => {
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
  );
  // Set up the array of image data and `media` keys.
  // You can have as many entries as you'd like.
  const sources = [
    ...getImage(mobileImage),
    {
      ...getImage(desktopImage),
      media: `(min-width: 491px)`,
    },
  ];

  return (
          <BgImage image={sources} style={{ minWidth: 200, minHeight: 200 }}>
            <div>Hello from BgImage!</div>
          </BgImage>
  );
};
```

### convertToBgImage()

Inside the Wrapper the following "magic" happens:

```jsx
// Convert it to the old format.
const bgImage = convertToBgImage(pluginImage);
```

`convertToBgImage()` takes an image of the form `IGatsbyImageData` (the result
from the new query). It then goes through the contents & extracts the necessary
images & remaining fields needed. You can of course use the result of the
function for the classic `gatsby-image` as well!


## Contributing

Everyone is more than welcome to contribute to this little package!  
Docs, Reviews, Testing, Code - whatever you want to add, just go for it : ).
So have a look at our [CONTRIBUTING](https://github.com/timhagn/gatsby-background-image/blob/main/CONTRIBUTING.md) file and give it a go.
Thanks in advance!
