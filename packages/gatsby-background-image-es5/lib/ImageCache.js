"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.resetImageCache = exports.activateCacheForMultipleImages = exports.activateCacheForImage = exports.allInImageCache = exports.inImageCache = void 0;

var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));

var _every = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/every"));

var _create = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/create"));

var _HelperUtils = require("./HelperUtils");

var _MediaUtils = require("./MediaUtils");

var _ImageUtils = require("./ImageUtils");

var imageCache = (0, _create.default)({});
/**
 * Cache if we've seen an image before so we don't both with
 * lazy-loading & fading in on subsequent mounts.
 *
 * @param props
 * @return {boolean}
 */

var inImageCache = function inImageCache(props) {
  var convertedProps = (0, _HelperUtils.convertProps)(props);

  if ((0, _HelperUtils.hasImageArray)(convertedProps) && !(0, _MediaUtils.hasArtDirectionArray)(convertedProps)) {
    return allInImageCache(props);
  } // Find src


  var src = (0, _ImageUtils.getImageSrcKey)(convertedProps);
  return imageCache[src] || false;
};
/**
 * Processes an array of cached images for inImageCache.
 *
 * @param props  object    Component Props (with fluid or fixed as array).
 * @return {*|boolean}
 */


exports.inImageCache = inImageCache;

var allInImageCache = function allInImageCache(props) {
  var convertedProps = (0, _HelperUtils.convertProps)(props); // Extract Image Array.

  var imageStack = convertedProps.fluid || convertedProps.fixed; // Only return true if every image is in cache.

  return (0, _every.default)(imageStack).call(imageStack, function (imageData) {
    if (convertedProps.fluid) {
      return inImageCache({
        fluid: imageData
      });
    }

    return inImageCache({
      fixed: imageData
    });
  });
};
/**
 * Adds an Image to imageCache.
 *
 * @param props
 */


exports.allInImageCache = allInImageCache;

var activateCacheForImage = function activateCacheForImage(props) {
  var convertedProps = (0, _HelperUtils.convertProps)(props);

  if ((0, _HelperUtils.hasImageArray)(convertedProps)) {
    return activateCacheForMultipleImages(props);
  } // Find src


  var src = (0, _ImageUtils.getImageSrcKey)(convertedProps);

  if (src) {
    imageCache[src] = true;
  }
};
/**
 * Activates the Cache for multiple Images.
 *
 * @param props
 */


exports.activateCacheForImage = activateCacheForImage;

var activateCacheForMultipleImages = function activateCacheForMultipleImages(props) {
  var convertedProps = (0, _HelperUtils.convertProps)(props); // Extract Image Array.

  var imageStack = convertedProps.fluid || convertedProps.fixed;
  (0, _forEach.default)(imageStack).call(imageStack, function (imageData) {
    if (convertedProps.fluid) {
      activateCacheForImage({
        fluid: imageData
      });
    } else {
      activateCacheForImage({
        fixed: imageData
      });
    }
  });
};
/**
 * Resets the image cache (especially important for reliable tests).
 */


exports.activateCacheForMultipleImages = activateCacheForMultipleImages;

var resetImageCache = function resetImageCache() {
  for (var prop in imageCache) {
    delete imageCache[prop];
  }
};

exports.resetImageCache = resetImageCache;