import BackgroundImage, {
  IBackgroundImageProps,
  IFixedObject,
  IFluidObject,
} from 'gatsby-background-image';
import { IGatsbyImageData } from 'gatsby-plugin-image/dist/src/components/gatsby-image.browser';
import React, { FunctionComponent } from 'react';

declare type BackgroundImageProps<T extends IntrinsicTags> = React.Component<InferExtraProps<T> & IBackgroundImageProps>;
declare type IBaseBgImageProps<T extends IntrinsicTags> = Omit<BackgroundImageProps<T>, 'fluid' | 'fixed'>;

export interface IBgImageProps extends IBaseBgImageProps {
  image?: IGatsbyImageData | (string | IGatsbyImageData | undefined)[];
}

export interface IGatsbyImageDataExtended extends IGatsbyImageData {
  media?: string;
}

/**
 * Tests a given value on being a string.
 *
 * @param value *   Value to test
 * @return {boolean}
 */
export const isString = (value: string | IGatsbyImageDataExtended): boolean =>
  Object.prototype.toString.call(value) === '[object String]';

/**
 * Returns the type of the imageData object.
 *
 * @param {IGatsbyImageData} imageData
 */
export const getBgImageType = (imageData: IGatsbyImageDataExtended): string =>
  imageData.layout === 'fixed' ? 'fixed' : 'fluid';

/**
 * Gives back the first image it finds.
 *
 * @param imageData
 */
export const getSingleImage = (
  imageData: (string | IGatsbyImageDataExtended)[]
): IGatsbyImageDataExtended | null => {
  let i: number;
  for (i = 0; i < imageData.length; i++) {
    if (isString(imageData[i])) continue;
    // @ts-ignore
    return imageData[i];
  }
  return null;
};

/**
 * Converts the aspect ratio to width & height.
 *
 * @param {IGatsbyImageData} imageData
 */
export const getAspectRatio = (imageData: IGatsbyImageDataExtended): number =>
  imageData.width / imageData.height;

interface IPlaceholderData {
  base64?: string;
  tracedSVG?: string;
}

/**
 * Extracts the placeholder image (if any).
 *
 * @param {IGatsbyImageData} imageData
 */
export const getPlaceholder = (
  imageData: IGatsbyImageDataExtended
): IPlaceholderData => {
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
}): string => {
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
export const getAllExtraSrcSets = (imageData: IGatsbyImageDataExtended) => {
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
 *
 *
 * @param imageData
 */
export const convertSingleBgImage = (
  imageData: IGatsbyImageDataExtended
): Partial<IBackgroundImageProps | null> => {
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
  return null;
};

/**
 * Converts an array of images.
 *
 * @param imageData
 */
const convertArrayOfImages = (
  imageData: (string | IGatsbyImageDataExtended)[]
): [string, Partial<IFixedObject[] | IFluidObject[] | string | null>] | [] => {
  // TODO: change to not extract from string!
  const singleImage = getSingleImage(imageData);
  if (singleImage) {
    const bgType = getBgImageType(singleImage);
    const convertedImageArray = imageData.map(
      (image: IGatsbyImageDataExtended | string) => {
        if (isString(image)) {
          return image;
        }
        // @ts-ignore
        const convertedImage = convertSingleBgImage(image);
        return {
          // @ts-ignore
          ...(convertedImage && convertedImage[bgType]),
          // @ts-ignore
          ...(image?.media ? { media: image.media } : {}),
        };
      }
    );
    // @ts-ignore
    return [bgType, convertedImageArray];
  }
  return [];
};

/**
 * Tries to Backport the new `gatsbyImageData` type to the classic `fluid` / `fixed` form.
 *
 * @param {object}    imageData    The image data to convert.
 * @returns {Partial<IBackgroundImageProps>|{}}
 */
export function convertToBgImage(
  imageData:
    | undefined
    | IGatsbyImageDataExtended
    | (string | IGatsbyImageDataExtended)[]
): Partial<IBackgroundImageProps | IBackgroundImageProps[] | null> {
  if (imageData) {
    if (Array.isArray(imageData)) {
      const [bgType, imageArray] = convertArrayOfImages(imageData);
      if (bgType) {
        return {
          [bgType]: imageArray,
        };
      }
      return null;
    }
    return convertSingleBgImage(imageData);
  }
  return null;
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
  const bgImage = image && convertToBgImage(image);
  if (bgImage) {
    return (
      <BackgroundImage {...bgImage} {...args}>
        {children}
      </BackgroundImage>
    );
  }
  return <div>{children}</div>;
};
