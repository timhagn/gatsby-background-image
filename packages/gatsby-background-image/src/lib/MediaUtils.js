import smq from 'sort-media-queries';
import { capitalize, isBrowser } from './SimpleUtils';

/**
 * Return an array ordered by elements having a media prop, does not use
 * native sort, as a stable sort is not guaranteed by all browsers/versions
 *
 * @param imageVariants   array   The art-directed images.-
 */
export const groupByMedia = imageVariants => {
  const without = [];
  const sortedVariants = smq(imageVariants, 'media');

  sortedVariants.forEach(variant => !variant.media && without.push(variant));

  if (without.length > 1 && process.env.NODE_ENV !== `production`) {
    console.warn(
      `We've found ${without.length} sources without a media property. They might be ignored by the browser, see: https://www.gatsbyjs.org/packages/gatsby-image/#art-directing-multiple-images`
    );
  }

  return sortedVariants;
};

/**
 * Creates a single source element to add srcSets.
 *
 * @param {object}  image       The image to add sources from.
 * @param {string}  type  Which srcSet to add.
 */
export const createSourceElementForSrcSet = (image, type) => {
  const source = document.createElement('source');
  const srcSetName = `srcSet${capitalize(type)}`;
  if (srcSetName in image) {
    source.type = `image/${type}`;
    source.srcset = image[srcSetName];
  }
  if (image.sizes) {
    source.sizes = image.sizes;
  }
  if (image.media) {
    source.media = image.media;
  }
  return source.srcset ? source : null;
};

/**
 * Creates a source Array from media objects.
 *
 * @param fluid
 * @param fixed
 * @return {*}
 */
export const createArtDirectionSources = ({ fluid, fixed }) => {
  const currentSource = fluid || fixed;
  return currentSource.reduce((sources, image) => {
    if (!image.media) {
      return sources;
    }
    const sourceWebp = createSourceElementForSrcSet(image, 'webp');
    const sourceAvif = createSourceElementForSrcSet(image, 'avif');
    sourceWebp && sources.push(sourceWebp);
    sourceAvif && sources.push(sourceAvif);
    return sources;
  }, []);
};

/**
 * Checks if fluid or fixed are art-direction arrays.
 *
 * @param props   object   The props to check for images.
 * @param prop    string   Check for fluid or fixed.
 * @return {boolean}
 */
export const hasArtDirectionSupport = (props, prop) =>
  props[prop] &&
  Array.isArray(props[prop]) &&
  props[prop].some(image => !!image && typeof image.media !== 'undefined');

/**
 * Checks for fluid or fixed Art direction support.
 * @param props
 * @return {boolean}
 */
export const hasArtDirectionArray = props =>
  hasArtDirectionSupport(props, 'fluid') ||
  hasArtDirectionSupport(props, 'fixed');

/**
 * Tries to detect if a media query matches the current viewport.
 *
 * @param media   string  A media query string.
 * @return {boolean}
 */
export const matchesMedia = ({ media }) => {
  return media
    ? isBrowser() &&
        typeof window.matchMedia !== `undefined` &&
        !!window.matchMedia(media).matches
    : false;
};
