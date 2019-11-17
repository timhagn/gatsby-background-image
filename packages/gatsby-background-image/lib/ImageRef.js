"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.activateMultiplePictureRefs = exports.activatePictureRef = exports.createMultiplePictureRefs = exports.createPictureRef = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _HelperUtils = require("./HelperUtils");

var _ImageUtils = require("./ImageUtils");

var _MediaUtils = require("./MediaUtils");

var _SimpleUtils = require("./SimpleUtils");

var createPictureRef = function createPictureRef(props, onLoad) {
  var convertedProps = (0, _HelperUtils.convertProps)(props);

  if ((0, _SimpleUtils.isBrowser)() && (typeof convertedProps.fluid !== "undefined" || typeof convertedProps.fixed !== "undefined")) {
    if ((0, _ImageUtils.hasImageArray)(convertedProps) && !(0, _MediaUtils.hasArtDirectionArray)(convertedProps)) {
      return createMultiplePictureRefs(props, onLoad);
    }

    var img = new Image();

    img.onload = function () {
      return onLoad();
    };

    if (!img.complete && typeof convertedProps.onLoad === "function") {
      img.addEventListener('load', convertedProps.onLoad);
    }

    if (typeof convertedProps.onError === "function") {
      img.addEventListener('error', convertedProps.onError);
    }

    if (convertedProps.crossOrigin) {
      img.crossOrigin = convertedProps.crossOrigin;
    } // Only directly activate the image if critical (preload).


    if (convertedProps.critical || convertedProps.isVisible) {
      return activatePictureRef(img, convertedProps);
    }

    return img;
  }

  return null;
};
/**
 * Creates multiple image references. Internal function.
 *
 * @param props   object    Component Props (with fluid or fixed as array).
 * @param onLoad  function  Callback for load handling.
 */


exports.createPictureRef = createPictureRef;

var createMultiplePictureRefs = function createMultiplePictureRefs(props, onLoad) {
  var convertedProps = (0, _HelperUtils.convertProps)(props); // Extract Image Array.

  var imageStack = convertedProps.fluid || convertedProps.fixed;
  return imageStack.map(function (imageData) {
    if (convertedProps.fluid) {
      return createPictureRef((0, _extends2.default)({}, convertedProps, {
        fluid: imageData
      }), onLoad);
    }

    return createPictureRef((0, _extends2.default)({}, convertedProps, {
      fixed: imageData
    }), onLoad);
  });
};
/**
 * Creates a picture element for the browser to decide which image to load.
 *
 * @param imageRef
 * @param props
 * @param selfRef
 * @return {null|Array|*}
 */


exports.createMultiplePictureRefs = createMultiplePictureRefs;

var activatePictureRef = function activatePictureRef(imageRef, props, selfRef) {
  if (selfRef === void 0) {
    selfRef = null;
  }

  var convertedProps = (0, _HelperUtils.convertProps)(props);

  if ((0, _SimpleUtils.isBrowser)() && (typeof convertedProps.fluid !== "undefined" || typeof convertedProps.fixed !== "undefined")) {
    if ((0, _ImageUtils.hasImageArray)(convertedProps) && !(0, _MediaUtils.hasArtDirectionArray)(convertedProps)) {
      return activateMultiplePictureRefs(imageRef, props, selfRef);
    } // Clone body to get the correct sizes.


    var bodyClone = document.body.cloneNode(true); // Do we have an Art-direction array? Then get its first(smallest) image.

    var imageData = (0, _MediaUtils.hasArtDirectionArray)(convertedProps) ? (0, _ImageUtils.getFirstImage)(convertedProps) : (0, _ImageUtils.getCurrentSrcData)(convertedProps); // Prevent adding HTMLPictureElement if it isn't supported (e.g. IE11),
    // but don't prevent it during SSR.

    if ((0, _ImageUtils.hasPictureElement)()) {
      var pic = document.createElement('picture');

      if (selfRef) {
        // Set original component's style.
        pic.width = imageRef.width = selfRef.offsetWidth;
        pic.height = imageRef.height = selfRef.offsetHeight;
      } // TODO: check why only the 1400 image gets loaded & single / stacked images don't!


      if ((0, _MediaUtils.hasArtDirectionArray)(convertedProps)) {
        var sources = (0, _MediaUtils.createArtDirectionSources)(convertedProps).reverse();
        sources.forEach(function (currentSource) {
          return pic.appendChild(currentSource);
        });
      }

      if (imageData.srcSetWebp) {
        var sourcesWebP = document.createElement('source');
        sourcesWebP.type = "image/webp";
        sourcesWebP.srcset = imageData.srcSetWebp;
        sourcesWebP.sizes = imageData.sizes;

        if (imageData.media) {
          sourcesWebP.media = imageData.media;
        }

        pic.appendChild(sourcesWebP);
      }

      pic.appendChild(imageRef);
      bodyClone.appendChild(pic);
    } else if (selfRef) {
      imageRef.width = selfRef.offsetWidth;
      imageRef.height = selfRef.offsetHeight;
    }

    imageRef.srcset = imageData.srcSet ? imageData.srcSet : "";
    imageRef.src = imageData.src ? imageData.src : "";
    return imageRef;
  }

  return null;
};
/**
 * Creates multiple picture elements.
 *
 * @param imageRefs
 * @param props
 * @param selfRef
 * @return {Array||null}
 */


exports.activatePictureRef = activatePictureRef;

var activateMultiplePictureRefs = function activateMultiplePictureRefs(imageRefs, props, selfRef) {
  if (imageRefs === void 0) {
    imageRefs = [];
  }

  var convertedProps = (0, _HelperUtils.convertProps)(props); // Extract Image Array.

  return imageRefs.map(function (imageRef, index) {
    if (convertedProps.fluid) {
      return activatePictureRef(imageRef, (0, _extends2.default)({}, convertedProps, {
        fluid: convertedProps.fluid[index]
      }), selfRef);
    }

    return activatePictureRef(imageRef, (0, _extends2.default)({}, convertedProps, {
      fixed: convertedProps.fixed[index]
    }), selfRef);
  });
};

exports.activateMultiplePictureRefs = activateMultiplePictureRefs;