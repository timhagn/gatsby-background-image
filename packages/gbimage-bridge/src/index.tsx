import BackgroundImage, {
  IBackgroundImageProps,
} from 'gatsby-background-image';
import { getImage } from 'gatsby-plugin-image';
import { IGatsbyImageData } from 'gatsby-plugin-image/dist/src/components/gatsby-image.browser';
import React, { CSSProperties, FunctionComponent } from 'react';

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

// TODO: add WebP & AVIF support (the latter to gbi as well ; ).
// TODO: add tests.

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
    // @ts-ignore
    returnBgObject[bgType] = {
      ...imageData.images.fallback,
      ...placeholder,
      aspectRatio,
    };
    return returnBgObject;
  }
  return {};
}

export interface IBgImageProps {
  fluid?: IGatsbyImageData;
  fixed?: IGatsbyImageData;
  className?: string;
  onClick?: (e: Event) => void;
  tabIndex?: number;
  fadeIn?: boolean;
  id?: string;
  style?: CSSProperties;
  role?: string;
  preserveStackingContext?: boolean;
}

/**
 * This is a temporary stopgap solution until `<BackgroundImage>` natively supports `gatsby-plugin-image`,
 * see [https://github.com/timhagn/gatsby-background-image/issues/141](https://github.com/timhagn/gatsby-background-image/issues/141).
 * @param {React.PropsWithChildren<IBgImageProps>} props
 * @return {JSX.Element}
 * @constructor
 * @author @rburgst <https://github.com/rburgst>
 */
export const BgImage: FunctionComponent<IBgImageProps> = props => {
  const { fluid, children, ...args } = props;
  if (fluid) {
    const image = getImage(fluid);
    const bgImage = image && convertToBgImage(image);
    return (
      <BackgroundImage {...bgImage} {...args}>
        {children}
      </BackgroundImage>
    );
  }
  return <div>{children}</div>;
};
