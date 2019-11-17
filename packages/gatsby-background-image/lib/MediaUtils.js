"use strict";

exports.__esModule = true;
exports.matchesMedia = exports.hasArtDirectionArray = exports.hasArtDirectionFixedArray = exports.hasArtDirectionFluidArray = exports.createArtDirectionSources = exports.groupByMedia = void 0;

var _HelperUtils = require("./HelperUtils");

var groupByMedia = function groupByMedia(imageVariants) {
  var withMedia = [];
  var without = [];
  imageVariants.forEach(function (variant) {
    return (variant.media ? withMedia : without).push(variant);
  });

  if (without.length > 1 && process.env.NODE_ENV !== "production") {
    console.warn("We've found " + without.length + " sources without a media property. They might be ignored by the browser, see: https://www.gatsbyjs.org/packages/gatsby-image/#art-directing-multiple-images");
  }

  return [].concat(withMedia, without);
};
/**
 * Creates a source Array from media objects.
 *
 * @param fluid
 * @param fixed
 * @return {*}
 */


exports.groupByMedia = groupByMedia;

var createArtDirectionSources = function createArtDirectionSources(_ref) {
  var fluid = _ref.fluid,
      fixed = _ref.fixed;
  var currentSource = fluid || fixed;
  return currentSource.map(function (image) {
    var source = document.createElement('source');
    source.srcset = image.srcSet;
    source.sizes = image.sizes;

    if (image.srcSetWebp) {
      source.type = "image/webp";
      source.srcset = image.srcSetWebp;
    }

    if (image.media) {
      source.media = image.media;
    }

    return source;
  });
};
/**
 * Checks if fluid or fixed are art-direction arrays.
 *
 * @param props   object   The props to check for images.
 * @return {boolean}
 */


exports.createArtDirectionSources = createArtDirectionSources;

var hasArtDirectionFluidArray = function hasArtDirectionFluidArray(props) {
  return props.fluid && Array.isArray(props.fluid) && props.fluid.some(function (fluidImage) {
    return typeof fluidImage.media !== 'undefined';
  });
};
/**
 * Checks if fluid or fixed are art-direction arrays.
 *
 * @param props   object   The props to check for images.
 * @return {boolean}
 */


exports.hasArtDirectionFluidArray = hasArtDirectionFluidArray;

var hasArtDirectionFixedArray = function hasArtDirectionFixedArray(props) {
  return props.fixed && Array.isArray(props.fixed) && props.fixed.some(function (fixedImage) {
    return typeof fixedImage.media !== 'undefined';
  });
};
/**
 * Checks for fluid or fixed Art direction support.
 * @param props
 * @return {boolean}
 */


exports.hasArtDirectionFixedArray = hasArtDirectionFixedArray;

var hasArtDirectionArray = function hasArtDirectionArray(props) {
  return hasArtDirectionFluidArray(props) || hasArtDirectionFixedArray(props);
};
/**
 * Tries to detect if a media query matches the current viewport.
 *
 * @param media   string  A media query string.
 * @return {*|boolean}
 */


exports.hasArtDirectionArray = hasArtDirectionArray;

var matchesMedia = function matchesMedia(_ref2) {
  var media = _ref2.media;
  return media && (0, _HelperUtils.isBrowser)() && window.matchMedia(media).matches;
};

exports.matchesMedia = matchesMedia;