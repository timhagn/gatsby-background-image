"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.matchesMedia = exports.hasArtDirectionArray = exports.hasArtDirectionFixedArray = exports.hasArtDirectionFluidArray = exports.createArtDirectionSources = exports.groupByMedia = void 0;

var _some = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/some"));

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));

var _sortMediaQueries = _interopRequireDefault(require("sort-media-queries"));

var _SimpleUtils = require("./SimpleUtils");

var groupByMedia = function groupByMedia(imageVariants) {
  var withMedia = [];
  var without = [];
  var sortedVariants = (0, _sortMediaQueries.default)(imageVariants, 'media');
  (0, _forEach.default)(imageVariants).call(imageVariants, function (variant) {
    return (variant.media ? withMedia : without).push(variant);
  });

  if (without.length > 1 && process.env.NODE_ENV !== "production") {
    console.warn("We've found " + without.length + " sources without a media property. They might be ignored by the browser, see: https://www.gatsbyjs.org/packages/gatsby-image/#art-directing-multiple-images");
  }

  return sortedVariants;
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
  return (0, _map.default)(currentSource).call(currentSource, function (image) {
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
  var _context;

  return props.fluid && (0, _isArray.default)(props.fluid) && (0, _some.default)(_context = props.fluid).call(_context, function (fluidImage) {
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
  var _context2;

  return props.fixed && (0, _isArray.default)(props.fixed) && (0, _some.default)(_context2 = props.fixed).call(_context2, function (fixedImage) {
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
  return media && (0, _SimpleUtils.isBrowser)() && window.matchMedia(media).matches;
};

exports.matchesMedia = matchesMedia;