"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.imageLoaded = exports.imageReferenceCompleted = exports.createDummyImageArray = exports.imageArrayPropsChanged = exports.imagePropsChanged = exports.getUrlString = exports.getCurrentSrcData = exports.getImageSrcKey = exports.getCurrentFromData = exports.hasPictureElement = void 0;

var _every = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/every"));

var _fill = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/fill"));

var _some = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/some"));

var _indexOf = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/index-of"));

var _reverse = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/reverse"));

var _findIndex = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/find-index"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _HelperUtils = require("./HelperUtils");

var _MediaUtils = require("./MediaUtils");

var hasPictureElement = function hasPictureElement() {
  return typeof HTMLPictureElement !== "undefined" || typeof window === "undefined";
};
/**
 * Extracts a value from an imageRef, image object or an array of them.
 *
 * @param data        HTMLImageElement||object||Array   Data to extract from.
 * @param propName    string    Property to extract.
 * @param addUrl      boolean   Should returned strings be encased in `url()`?
 * @param returnArray boolean   Switches between returning an array and a string.
 * @param checkLoaded boolean   Turns checking for imageLoaded() on and off.
 * @return {string||array}
 */


exports.hasPictureElement = hasPictureElement;

var getCurrentFromData = function getCurrentFromData(_ref) {
  var data = _ref.data,
      propName = _ref.propName,
      _ref$addUrl = _ref.addUrl,
      addUrl = _ref$addUrl === void 0 ? true : _ref$addUrl,
      _ref$returnArray = _ref.returnArray,
      returnArray = _ref$returnArray === void 0 ? false : _ref$returnArray,
      _ref$checkLoaded = _ref.checkLoaded,
      checkLoaded = _ref$checkLoaded === void 0 ? true : _ref$checkLoaded;
  if (!data || !propName) return ""; // Handle tracedSVG with "special care".

  var tracedSVG = propName === "tracedSVG";

  if ((0, _isArray.default)(data) && !(0, _MediaUtils.hasArtDirectionArray)({
    fluid: data
  })) {
    // Filter out all elements not having the propName and return remaining.
    var imageString = (0, _map.default)(data // .filter(dataElement => {
    //   return propName in dataElement && dataElement[propName]
    // })
    ).call(data, function (dataElement) {
      // If `currentSrc` or `src` is needed, check image load completion first.
      if (propName === "currentSrc" || propName === 'src') {
        return checkLoaded ? imageLoaded(dataElement) && dataElement[propName] || "" : dataElement[propName];
      } // Check if CSS strings should be parsed.


      if (propName === "CSS_STRING" && (0, _HelperUtils.isString)(dataElement)) {
        return dataElement;
      }

      return dataElement[propName] || "";
    }); // Encapsulate in URL string and return.

    return getUrlString({
      imageString: imageString,
      tracedSVG: tracedSVG,
      addUrl: addUrl,
      returnArray: returnArray
    });
  }

  if ((0, _MediaUtils.hasArtDirectionArray)({
    fluid: data
  }) && (propName === "currentSrc" || propName === 'src')) {
    var currentData = getCurrentSrcData({
      fluid: data
    });
    return propName in currentData ? getUrlString({
      imageString: currentData[propName],
      tracedSVG: tracedSVG,
      addUrl: addUrl
    }) : "";
  } // If `currentSrc` or `src` is needed, check image load completion first.


  if ((propName === "currentSrc" || propName === 'src') && propName in data) {
    return getUrlString({
      imageString: checkLoaded ? imageLoaded(data) && data[propName] || "" : data[propName],
      addUrl: addUrl
    });
  }

  return propName in data ? getUrlString({
    imageString: data[propName],
    tracedSVG: tracedSVG,
    addUrl: addUrl
  }) : "";
};
/**
 * Find the source of an image to use as a key in the image cache.
 * Use `the first matching image in either `fixed` or `fluid`
 *
 * @param {{fluid: {src: string}[], fixed: {src: string}[]}} args
 * @return {string|null}
 */


exports.getCurrentFromData = getCurrentFromData;

var getImageSrcKey = function getImageSrcKey(_ref2) {
  var fluid = _ref2.fluid,
      fixed = _ref2.fixed;
  var data = getCurrentSrcData({
    fluid: fluid,
    fixed: fixed
  });
  return data ? data.src || null : null;
};
/**
 * Returns the current src if possible with art-direction support.
 *
 * @param fluid   object    Fluid Image (Array) if existent.
 * @param fixed   object    Fixed Image (Array) if existent.v
 * @return {*}
 */


exports.getImageSrcKey = getImageSrcKey;

var getCurrentSrcData = function getCurrentSrcData(_ref3) {
  var fluid = _ref3.fluid,
      fixed = _ref3.fixed;
  var currentData = fluid || fixed;

  if ((0, _HelperUtils.hasImageArray)({
    fluid: fluid,
    fixed: fixed
  })) {
    if ((0, _HelperUtils.isBrowser)() && (0, _MediaUtils.hasArtDirectionArray)({
      fluid: fluid,
      fixed: fixed
    })) {
      var _context;

      // Do we have an image for the current Viewport?
      var foundMedia = (0, _findIndex.default)(_context = (0, _reverse.default)(currentData).call(currentData)).call(_context, _MediaUtils.matchesMedia);

      if (foundMedia !== -1) {
        return (0, _reverse.default)(currentData).call(currentData)[foundMedia];
      }
    } // Else return the first image.


    return currentData[0];
  }

  return currentData;
};
/**
 * Encapsulates an imageString with a url if needed.
 *
 * @param imageString   string    String to encapsulate.
 * @param tracedSVG     boolean   Special care for SVGs.
 * @param addUrl        boolean   If the string should be encapsulated or not.
 * @param returnArray   boolean   Return concatenated string or Array.
 * @param hasImageUrls  boolean   Force return of quoted string(s) for url().
 * @return {string||array}
 */


exports.getCurrentSrcData = getCurrentSrcData;

var getUrlString = function getUrlString(_ref4) {
  var imageString = _ref4.imageString,
      _ref4$tracedSVG = _ref4.tracedSVG,
      tracedSVG = _ref4$tracedSVG === void 0 ? false : _ref4$tracedSVG,
      _ref4$addUrl = _ref4.addUrl,
      addUrl = _ref4$addUrl === void 0 ? true : _ref4$addUrl,
      _ref4$returnArray = _ref4.returnArray,
      returnArray = _ref4$returnArray === void 0 ? false : _ref4$returnArray,
      _ref4$hasImageUrls = _ref4.hasImageUrls,
      hasImageUrls = _ref4$hasImageUrls === void 0 ? false : _ref4$hasImageUrls;

  if ((0, _isArray.default)(imageString)) {
    var stringArray = (0, _map.default)(imageString).call(imageString, function (currentString) {
      if (currentString) {
        var _base = (0, _indexOf.default)(currentString).call(currentString, "base64") !== -1;

        var _imageUrl = hasImageUrls || currentString.substr(0, 4) === "http";

        var currentReturnString = currentString && tracedSVG ? "\"" + currentString + "\"" : currentString && !_base && !tracedSVG && _imageUrl ? "'" + currentString + "'" : currentString;
        return addUrl && currentString ? "url(" + currentReturnString + ")" : currentReturnString;
      }

      return currentString;
    });
    return returnArray ? stringArray : (0, _HelperUtils.filteredJoin)(stringArray);
  }

  var base64 = (0, _indexOf.default)(imageString).call(imageString, "base64") !== -1;
  var imageUrl = hasImageUrls || imageString.substr(0, 4) === "http";
  var returnString = imageString && tracedSVG ? "\"" + imageString + "\"" : imageString && !base64 && !tracedSVG && imageUrl ? "'" + imageString + "'" : imageString;
  return imageString ? addUrl ? "url(" + returnString + ")" : returnString : "";
};
/**
 * Checks if any image props have changed.
 *
 * @param props
 * @param prevProps
 * @return {*}
 */


exports.getUrlString = getUrlString;

var imagePropsChanged = function imagePropsChanged(props, prevProps) {
  return (// Do we have different image types?
    props.fluid && !prevProps.fluid || props.fixed && !prevProps.fixed || imageArrayPropsChanged(props, prevProps) || // Are single image sources different?
    props.fluid && prevProps.fluid && props.fluid.src !== prevProps.fluid.src || props.fixed && prevProps.fixed && props.fixed.src !== prevProps.fixed.src
  );
};
/**
 * Decides if two given props with array images differ.
 *
 * @param props
 * @param prevProps
 * @return {boolean}
 */


exports.imagePropsChanged = imagePropsChanged;

var imageArrayPropsChanged = function imageArrayPropsChanged(props, prevProps) {
  var isPropsFluidArray = (0, _isArray.default)(props.fluid);
  var isPrevPropsFluidArray = (0, _isArray.default)(prevProps.fluid);
  var isPropsFixedArray = (0, _isArray.default)(props.fixed);
  var isPrevPropsFixedArray = (0, _isArray.default)(prevProps.fixed);

  if ( // Did the props change to a single image?
  isPropsFluidArray && !isPrevPropsFluidArray || isPropsFixedArray && !isPrevPropsFixedArray || // Did the props change to an Array?
  !isPropsFluidArray && isPrevPropsFluidArray || !isPropsFixedArray && isPrevPropsFixedArray) {
    return true;
  } // Are the lengths or sources in the Arrays different?


  if (isPropsFluidArray && isPrevPropsFluidArray) {
    if (props.fluid.length === prevProps.fluid.length) {
      var _context2;

      // Check for individual image or CSS string changes.
      return (0, _some.default)(_context2 = props.fluid).call(_context2, function (image, index) {
        return image.src !== prevProps.fluid[index].src;
      });
    }

    return true;
  } else if (isPropsFixedArray && isPrevPropsFixedArray) {
    if (props.fixed.length === prevProps.fixed.length) {
      var _context3;

      // Check for individual image or CSS string changes.
      return (0, _some.default)(_context3 = props.fixed).call(_context3, function (image, index) {
        return image.src !== prevProps.fixed[index].src;
      });
    }

    return true;
  }
};
/**
 * Creates an array with a transparent dummy pixel for background-* properties.
 *
 * @param length
 * @return {any[]}
 */


exports.imageArrayPropsChanged = imageArrayPropsChanged;

var createDummyImageArray = function createDummyImageArray(length) {
  var _context4;

  var DUMMY_IMG = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
  var dummyImageURI = getUrlString({
    imageString: DUMMY_IMG
  });
  return (0, _fill.default)(_context4 = Array(length)).call(_context4, dummyImageURI);
};
/**
 * Checks if an image (array) reference is existing and tests for complete.
 *
 * @param imageRef    HTMLImageElement||array   Image reference(s).
 * @return {boolean}
 */


exports.createDummyImageArray = createDummyImageArray;

var imageReferenceCompleted = function imageReferenceCompleted(imageRef) {
  return imageRef ? (0, _isArray.default)(imageRef) ? (0, _every.default)(imageRef).call(imageRef, function (singleImageRef) {
    return imageLoaded(singleImageRef);
  }) : imageLoaded(imageRef) : false;
};
/**
 * Checks if an image really was fully loaded.
 *
 * @param imageRef  HTMLImageElement  Reference to an image.
 * @return {boolean}
 */


exports.imageReferenceCompleted = imageReferenceCompleted;

var imageLoaded = function imageLoaded(imageRef) {
  return imageRef ? imageRef.complete && imageRef.naturalWidth !== 0 && imageRef.naturalHeight !== 0 : false;
};

exports.imageLoaded = imageLoaded;