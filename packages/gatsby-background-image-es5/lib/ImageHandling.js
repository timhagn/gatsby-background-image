"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.initialBgImage = exports.switchImageSettings = void 0;

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _HelperUtils = require("./HelperUtils");

var _ImageUtils = require("./ImageUtils");

var _MediaUtils = require("./MediaUtils");

var switchImageSettings = function switchImageSettings(_ref) {
  var image = _ref.image,
      bgImage = _ref.bgImage,
      imageRef = _ref.imageRef,
      state = _ref.state;
  // Read currentSrc from imageRef (if exists).
  var currentSources = (0, _ImageUtils.getCurrentFromData)({
    data: imageRef,
    propName: "currentSrc"
  }); // Check if image is Array.

  var returnArray = (0, _isArray.default)(image) && !(0, _MediaUtils.hasArtDirectionArray)({
    fluid: image
  }); // Backup bgImage to lastImage.

  var lastImage = (0, _isArray.default)(bgImage) ? (0, _HelperUtils.filteredJoin)(bgImage) : bgImage; // Set the backgroundImage according to images available.

  var nextImage;
  var nextImageArray; // Signal to `createPseudoStyles()` when we have reached the final image,
  // which is important for transparent background-image(s).

  var finalImage = false;

  if (returnArray) {
    // Check for tracedSVG first.
    nextImage = (0, _ImageUtils.getCurrentFromData)({
      data: image,
      propName: "tracedSVG",
      returnArray: returnArray
    }); // Now combine with base64 images.

    nextImage = (0, _HelperUtils.combineArray)((0, _ImageUtils.getCurrentFromData)({
      data: image,
      propName: "base64",
      returnArray: returnArray
    }), nextImage); // Now add possible `rgba()` or similar CSS string props.

    nextImage = (0, _HelperUtils.combineArray)((0, _ImageUtils.getCurrentFromData)({
      data: image,
      propName: "CSS_STRING",
      addUrl: false,
      returnArray: returnArray
    }), nextImage); // Do we have at least one img loaded?

    if (state.imgLoaded && state.isVisible) {
      if (currentSources) {
        nextImage = (0, _HelperUtils.combineArray)((0, _ImageUtils.getCurrentFromData)({
          data: imageRef,
          propName: "currentSrc",
          returnArray: returnArray
        }), nextImage);
        finalImage = true;
      } else {
        // No support for HTMLPictureElement or WebP present, get src.
        nextImage = (0, _HelperUtils.combineArray)((0, _ImageUtils.getCurrentFromData)({
          data: imageRef,
          propName: "src",
          returnArray: returnArray
        }), nextImage);
        finalImage = true;
      }
    } // First fill last images from bgImage...


    nextImage = (0, _HelperUtils.combineArray)(nextImage, bgImage); // ... then fill the rest of the background-images with a transparent dummy
    // pixel, lest the background-* properties can't target the correct image.

    var dummyArray = (0, _ImageUtils.createDummyImageArray)(image.length); // Now combine the two arrays and join them.

    nextImage = (0, _HelperUtils.combineArray)(nextImage, dummyArray);
    nextImageArray = nextImage;
    nextImage = (0, _HelperUtils.filteredJoin)(nextImage);
  } else {
    nextImage = "";
    if (image.tracedSVG) nextImage = (0, _ImageUtils.getCurrentFromData)({
      data: image,
      propName: "tracedSVG"
    });
    if (image.base64 && !image.tracedSVG) nextImage = (0, _ImageUtils.getCurrentFromData)({
      data: image,
      propName: "base64"
    });

    if (state.imgLoaded && state.isVisible) {
      nextImage = currentSources;
      finalImage = true;
    }
  } // Change opacity according to imageState.


  var afterOpacity = state.imageState % 2;

  if (!returnArray && nextImage === "" && state.imgLoaded && state.isVisible && imageRef && !imageRef.currentSrc) {
    // Should we still have no nextImage it might be because currentSrc is missing.
    nextImage = (0, _ImageUtils.getCurrentFromData)({
      data: imageRef,
      propName: "src",
      checkLoaded: false
    });
    finalImage = true;
  } // Fall back on lastImage (important for prop changes) if all else fails.


  if (!nextImage) nextImage = lastImage;
  var newImageSettings = {
    lastImage: lastImage,
    nextImage: nextImage,
    afterOpacity: afterOpacity,
    finalImage: finalImage
  }; // Add nextImageArray for bgImage to newImageSettings if exists.

  if (nextImageArray) newImageSettings.nextImageArray = nextImageArray;
  return newImageSettings;
};
/**
 * Prepares initial background image(s).
 *
 * @param props         object    Component properties.
 * @param withDummies   boolean   If array preserving bg layering should be add.
 * @return {string|(string|Array)}
 */


exports.switchImageSettings = switchImageSettings;

var initialBgImage = function initialBgImage(props, withDummies) {
  if (withDummies === void 0) {
    withDummies = true;
  }

  var convertedProps = (0, _HelperUtils.convertProps)(props);
  var image = convertedProps.fluid || convertedProps.fixed; // Prevent failing if neither fluid nor fixed are present.

  if (!image) return "";
  var returnArray = (0, _HelperUtils.hasImageArray)(convertedProps);
  var initialImage;

  if (returnArray) {
    // Check for tracedSVG first.
    initialImage = (0, _ImageUtils.getCurrentFromData)({
      data: image,
      propName: "tracedSVG",
      returnArray: returnArray
    }); // Now combine with base64 images.

    initialImage = (0, _HelperUtils.combineArray)((0, _ImageUtils.getCurrentFromData)({
      data: image,
      propName: "base64",
      returnArray: returnArray
    }), initialImage); // Now add possible `rgba()` or similar CSS string props.

    initialImage = (0, _HelperUtils.combineArray)((0, _ImageUtils.getCurrentFromData)({
      data: image,
      propName: "CSS_STRING",
      addUrl: false,
      returnArray: returnArray
    }), initialImage);

    if (withDummies) {
      var dummyArray = (0, _ImageUtils.createDummyImageArray)(image.length); // Now combine the two arrays and join them.

      initialImage = (0, _HelperUtils.combineArray)(initialImage, dummyArray);
    }
  } else {
    initialImage = "";
    if (image.tracedSVG) initialImage = (0, _ImageUtils.getCurrentFromData)({
      data: image,
      propName: "tracedSVG"
    });
    if (image.base64 && !image.tracedSVG) initialImage = (0, _ImageUtils.getCurrentFromData)({
      data: image,
      propName: "base64"
    });
  }

  return initialImage;
};

exports.initialBgImage = initialBgImage;