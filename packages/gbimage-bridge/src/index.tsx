import BackgroundImage, {
  IBackgroundImageProps,
} from 'gatsby-background-image';
import { getImage } from 'gatsby-plugin-image';
import { IGatsbyImageData } from 'gatsby-plugin-image/dist/src/components/gatsby-image.browser';
import React, { FunctionComponent } from 'react';

/**
 * Returns the type of the imageData object.
 *
 * @param {IGatsbyImageData} imageData
 */
const getBgImageType = (imageData: IGatsbyImageData) =>
  imageData.layout === 'fixed' ? 'fixed' : 'fluid';

/**
 * Converts the aspect ratio to width & height.
 *
 * @param {IGatsbyImageData} imageData
 */
const getAspectRatio = (imageData: IGatsbyImageData) =>
  imageData.width / imageData.height;

/**
 * Extracts the placeholder image (if any).
 *
 * @param {IGatsbyImageData} imageData
 */
const getPlaceholder = (imageData: IGatsbyImageData) => {
  if (imageData.placeholder) {
    return imageData.placeholder?.fallback?.includes(`base64`)
      ? { base64: imageData.placeholder?.fallback }
      : { tracedSVG: imageData.placeholder?.fallback };
  }
  return {};
};

/**
 * Extracts the extra src{Type} from sources srcSets.
 *
 * @param {string} srcSet
 */
const getSrc = (srcSet: string) => {
  if (srcSet) {
    const srcSetRegex = /(?:([^"'\s,]+)\s*(?:\s+\d+[wx])(?:,\s*)?)/gm;
    const allSources = [...srcSet.matchAll(srcSetRegex)];
    const initialSource = allSources.filter(
      src => src?.[0].includes('100w') || src?.[0].includes('1x')
    );
    return initialSource?.[0][1];
  }
  return '';
};

/**
 * Loops through all sources & creates srcSet{Type} entries for `gbi`.
 *
 * @param imageData
 */
const getAllExtraSrcSets = (imageData: IGatsbyImageData) => {
  if (imageData.images?.sources && Array.isArray(imageData.images?.sources)) {
    return imageData.images?.sources.reduce((srcSets, sourceImage) => {
      const typeFromMime = sourceImage?.type?.split('/')[1] || '';
      const sourceType =
        typeFromMime?.charAt(0).toUpperCase() + typeFromMime.slice(1);
      const possibleExtraSrcSet = `srcSet${sourceType}`;
      const possibleExtraSrc = `src${sourceType}`;
      if (sourceType) {
        if (!(possibleExtraSrcSet in srcSets)) {
          // @ts-ignore
          srcSets[possibleExtraSrcSet] = sourceImage?.srcSet;
        }
        if (!(possibleExtraSrc in srcSets)) {
          // @ts-ignore
          srcSets[possibleExtraSrc] = getSrc(sourceImage?.srcSet);
        }
      }
      return srcSets;
    }, {});
  }
  return {};
};

// TODO: AVIF support to gbi as well ; ).
// TODO: add tests.

/**
 *
 * Old Fixed:
{
  "tracedSVG": "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='400'%20height='400'%20viewBox='0%200%20400%20400'%20preserveAspectRatio='none'%3e%3cpath%20d='M0%20200v200h81v-8c0-7%202-15%204-14l2%203%202%203%202%202c2%205%204%200%203-5-2-5-3-6-4-3-2%201-2%201-2-3%200-5%200-5%202-4%203%203%204%200%203-9v-22c0-2%202-1%203%202l1%202%201%204%201%204c2%200%204%207%205%2013%201%202%201%202%202%201%202-4%200-29-3-30l-3-4-4-2c-6%200%205-6%2014-8%203%200%203-3%201-5l-1-3-1-2-2-3c-3-7-3-8-5-7%200%201-2%202-5%202h-4v-5c0-5%203-9%203-5l2%202c2%200%203-1%201-2l-1-4-1-2-4-8%205-2c11-2%2012-3%208-4-3%200-3-2%200-2s3-3%200-4-6%202-6%204l-2%202c-3%200-5-1-4-2l2-8a157%20157%200%20017-21c2-3%201-6-1-6-3%200-5%201-5%203%200%203-1%203-4%202v-2l1-4c0-3%200-4%202-4s2-1%202-8c0-8%201-10%203-5l2%202%201%203%201%203%201-7c0-6%200-6%203-9l4-3%203-2c2-2-1-1-7%202l-7%202-3%202c-3%202-4%201-2-2l2-4%201-2c3%200%206-5%205-6-2-2-1-3%201-2%202%200%202%200%201-1l-1-10v-9H96c-2%200-3-3-2-4l5-1h5l-2-1c-3%200-4-2-3-12l-3-28c0-3%200-3-4-2h-4v-8l-1-4c0-4%200-4%203-4s3%200%203-4c0-3-1-5-3-7l-2-1c0%202-2%201-3-1l-3-3V84c1-5%202-7%203-7l2%201%202%203%203%205%203%204%203%202c1%200%203-3%201-4l-1-12c0-11%200-12-2-13-2-2-3-3-3-5%200-3-2-9-5-14l2-1c4-1%204-10%200-12h-2l-2%201c-2%200-2%200-2-9v-4c1-2%201-3-1-3l-1-1-2-3-2-7-1-5-1%202-1%201-1-1c0-2-5-2-37-2H0v200M330%204l-3%204-1%2012-1%2012c-1%201-1%202%201%203%206%205%206%205%206%2011l1%2012c0%206%200%206-2%206-3%200-3%200-3%208l-2%208-1%202-1%202c-2-2-2%201-2%2010%200%2010%201%2013%205%2014l2%202%201%202v13c-1%203-2%203-5%203h-3v5l1%206c1%201%205-3%205-5l4-4v11a216%20216%200%2000-1%2027l-1%204-1%204c-2%200-2%201-2%204s0%204%202%204l1%2012v12h-5c-3%200-5%201-5%202h9c2-1%202-1%201%205a674%20674%200%2000-3%2012c-2%201-2%201-3-2l-1-2-1%204-1%205c-1%201-1%201%201%202%202%202%203%202%203%200l2-2%201%2012%201%2012v36h-1l-2-1-4-1c-3-4-4-2-4%206%200%207%200%208%202%208s2%201%202%204l-1%204-1%201%204%201%204-1%201-1%201%208%202%2012v8l-3%204-1%208%201%208c2%200%201%207-1%209-2%201-3%2015-1%2015l1%202%201%204%201%205v5h70V0h-70v4'%20fill='%23d3d3d3'%20fill-rule='evenodd'/%3e%3c/svg%3e",
  "width": 460,
  "height": 460,
  "src": "/static/41d69c74142edcc878ff7122603d84d2/b873a/seamless-bg-desktop.jpg",
  "srcSet": "/static/41d69c74142edcc878ff7122603d84d2/b873a/seamless-bg-desktop.jpg 1x,\n/static/41d69c74142edcc878ff7122603d84d2/d6678/seamless-bg-desktop.jpg 1.5x,\n/static/41d69c74142edcc878ff7122603d84d2/4e698/seamless-bg-desktop.jpg 2x",
  "srcWebp": "/static/41d69c74142edcc878ff7122603d84d2/9a82a/seamless-bg-desktop.webp",
  "srcSetWebp": "/static/41d69c74142edcc878ff7122603d84d2/9a82a/seamless-bg-desktop.webp 1x,\n/static/41d69c74142edcc878ff7122603d84d2/f3dc3/seamless-bg-desktop.webp 1.5x,\n/static/41d69c74142edcc878ff7122603d84d2/e4222/seamless-bg-desktop.webp 2x"
}
 *
 * New Fluid:
 {
  "layout": "constrained",
  "placeholder": {
    "fallback": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAPCAYAAADkmO9VAAAACXBIWXMAAAsTAAALEwEAmpwYAAADLUlEQVQ4y2NgoADsWDuJYV53EcOC5iCGzUvbGCZPmkW+Ye+fX2DYtLyHYemUKob///8zbFnWwbR1wwomigx8ducUw8E9OxnuXT/BcP74fpYzxw8xM1hZWqBgUgz8//8Fw/3bFxn+fLrAeO7UEbbHd24wMdjaWoMVFOZmMPR2NDIc2b2BoGFGBtpAw36Bvbp6yWSG7++v865c1M+2Yt4cHoboyGBGkMSk3jaGdcvnMVw+tZ+ggaxsEgycXBJAlgqYD9IfEuAjunj2NF0Qn3FSTysTSPD//+8M96+dYuDj4yPS48oM0/syGPZtW8G8YfUCnvWrlioynDi0im3L6oWsK+dPY9y6ZhHD8T0bGeTl5HAaoSQjyWBlocdgaa4LooUsTLWFgY5hzclIYOpsbuRmOLNvrYCHqyPb5AltYA3CQkIMIsLCDCwszNgNlJVicLIzZHAEYhdHYzZXJyM2Xy93RqAUc15mDDdDb2M+e3x0JJucnBwHMzMzSIJBUV6eIScpnqEiL5vBSE8XiHXA2FBXl8EUGCF6WooM2uoKDGIibAzK8orMooLcbL2dHVyzJ/dKMKioyEuDQ0NJAeyk/z8/M1iZGTA4A5OQv4sTg7G+LoO2hgaDCdBAUDj3VRUxZGfEM6goyDIK8nDyK8pIsQsJCvC31JTzbFy2UJxBSEiQR0RQHBzTAvx8TEa62syGuhoMutYmDJuXz2cQFxZh0FBTY9DXVAe7fmF3E4O+jjpDUVE+w9JFs7namutYLc3NRcqKctkCA/zBUc4S5OvAuWjeDBZzQx3m49s3CEYG+XCANJ/Yu4WBk0OQwcrEiMFIX1/w8LJVTEv62rhVlOS5XJwcWLduWim4fv0qNltra5as9GQBYWEhQYand2+zJMUGsuhoqQsDncD28t4l3o76Ms6/Tx8yXDi6mx2crthZGBQV5fjzkqI4ty6YINdUmqHkam/Fqq0qz+liZ8bf0VDOHxkWLAWMB1GGid2dkMTKwiTCz8fNLycjxSAnI82hrKgg1l5TJnBy/xrmWZOaGWRlxNgdbIzY2yoyxeb21oqoqyqwebvactlZGiskx4TwwlIBAPhL/1n+gpVRAAAAAElFTkSuQmCC"
  },
  "images": {
    "fallback": {
      "src": "/static/f6ae9d60c37065f389a04cb5ff400156/2c67b/bubbles.png",
      "srcSet": "/static/f6ae9d60c37065f389a04cb5ff400156/6e317/bubbles.png 50w,\n/static/f6ae9d60c37065f389a04cb5ff400156/4e4d4/bubbles.png 100w,\n/static/f6ae9d60c37065f389a04cb5ff400156/2c67b/bubbles.png 200w,\n/static/f6ae9d60c37065f389a04cb5ff400156/6addd/bubbles.png 400w",
      "sizes": "(min-width: 200px) 200px, 100vw"
    },
    "sources": [
      {
        "srcSet": "/static/f6ae9d60c37065f389a04cb5ff400156/5cff3/bubbles.avif 50w,\n/static/f6ae9d60c37065f389a04cb5ff400156/82098/bubbles.avif 100w,\n/static/f6ae9d60c37065f389a04cb5ff400156/1aafe/bubbles.avif 200w,\n/static/f6ae9d60c37065f389a04cb5ff400156/6707c/bubbles.avif 400w",
        "type": "image/avif",
        "sizes": "(min-width: 200px) 200px, 100vw"
      },
      {
        "srcSet": "/static/f6ae9d60c37065f389a04cb5ff400156/1a81d/bubbles.webp 50w,\n/static/f6ae9d60c37065f389a04cb5ff400156/f6ea0/bubbles.webp 100w,\n/static/f6ae9d60c37065f389a04cb5ff400156/b5535/bubbles.webp 200w,\n/static/f6ae9d60c37065f389a04cb5ff400156/f5c71/bubbles.webp 400w",
        "type": "image/webp",
        "sizes": "(min-width: 200px) 200px, 100vw"
      }
    ]
  },
  "width": 200,
  "height": 150
}

 */

/**
 * Tries to Backport the new `gatsbyImageData` type to the classic `fluid` / `fixed` form.
 *
 * @param {object}    imageData    The image data to convert.
 * @returns {Partial<IBackgroundImageProps>|{}}
 */
export function convertToBgImage(
  imageData: IGatsbyImageData
): Partial<IBackgroundImageProps> {
  if (imageData && imageData.layout) {
    const returnBgObject: Partial<IBackgroundImageProps> = {};
    const bgType = getBgImageType(imageData);
    const aspectRatio = getAspectRatio(imageData);
    const placeholder = getPlaceholder(imageData);
    const extraSrcSets = getAllExtraSrcSets(imageData);
    // @ts-ignore
    returnBgObject[bgType] = {
      ...imageData.images.fallback,
      ...extraSrcSets,
      ...placeholder,
      aspectRatio,
    };
    return returnBgObject;
  }
  return {};
}

type IBaseBgImageProps = Omit<IBackgroundImageProps, 'fluid' | 'fixed'>;
export interface IBgImageProps extends IBaseBgImageProps {
  image?: IGatsbyImageData;
}

/**
 * This is a temporary stopgap solution until `<BackgroundImage>` natively supports `gatsby-plugin-image`,
 * see [https://github.com/timhagn/gatsby-background-image/issues/141](https://github.com/timhagn/gatsby-background-image/issues/141).
 *
 * @param {React.PropsWithChildren<IBgImageProps>} props
 * @return {JSX.Element}
 * @constructor
 * @author @rburgst <https://github.com/rburgst> (of the original in the Issue)
 */
export const BgImage: FunctionComponent<IBgImageProps> = props => {
  const { image, children, ...args } = props;
  if (image) {
    const pluginImage = getImage(image);
    const bgImage = pluginImage && convertToBgImage(pluginImage);
    return (
      <BackgroundImage {...bgImage} {...args}>
        {children}
      </BackgroundImage>
    );
  }
  return <div>{children}</div>;
};
