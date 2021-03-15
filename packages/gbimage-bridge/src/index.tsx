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
export const getBgImageType = (imageData: IGatsbyImageData) =>
  imageData.layout === 'fixed' ? 'fixed' : 'fluid';

/**
 * Converts the aspect ratio to width & height.
 *
 * @param {IGatsbyImageData} imageData
 */
export const getAspectRatio = (imageData: IGatsbyImageData) =>
  imageData.width / imageData.height;

/**
 * Extracts the placeholder image (if any).
 *
 * @param {IGatsbyImageData} imageData
 */
export const getPlaceholder = (imageData: IGatsbyImageData) => {
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
 * @param {object} sourceImage
 */
export const getSrc = (sourceImage: {
  srcSet: string;
  type: string;
  sizes: string;
}) => {
  if (sourceImage.srcSet) {
    const srcSetRegex = /(?:([^"'\s,]+)\s*(?:\s+\d+[wx])(?:,\s*)?)/gm;
    const allSources = [...sourceImage.srcSet.matchAll(srcSetRegex)];
    const size = sourceImage.sizes.replace('px', '');
    const initialSource = allSources.filter(src => {
      return (
        src?.[0].includes('100w') ||
        src?.[0].includes('1x') ||
        src?.[0].includes(`${size}w`)
      );
    });
    return initialSource?.[0]?.[1] || '';
  }
  return '';
};

/**
 * Loops through all sources & creates srcSet{Type} entries for `gbi`.
 *
 * @param imageData
 */
export const getAllExtraSrcSets = (imageData: IGatsbyImageData) => {
  if (imageData.images?.sources && Array.isArray(imageData.images?.sources)) {
    return imageData.images?.sources.reduce((srcSets, sourceImage) => {
      const typeFromMime = sourceImage?.type?.split('/')[1] || '';
      const sourceType =
        typeFromMime?.charAt(0).toUpperCase() + typeFromMime.slice(1);
      const possibleExtraSrcSet = `srcSet${sourceType}`;
      const possibleExtraSrc = `src${sourceType}`;
      if (sourceType) {
        if (!(possibleExtraSrcSet in srcSets) && sourceImage?.srcSet) {
          // @ts-ignore
          srcSets[possibleExtraSrcSet] = sourceImage.srcSet;
        }
        if (!(possibleExtraSrc in srcSets) && sourceImage?.srcSet) {
          // @ts-ignore
          srcSets[possibleExtraSrc] = getSrc(sourceImage);
        }
      }
      return srcSets;
    }, {});
  }
  return {};
};

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
      ...(bgType === 'fluid' ? { aspectRatio } : {}),
      ...(bgType === 'fixed'
        ? { width: imageData.width, height: imageData.height }
        : {}),
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
