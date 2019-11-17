"use strict";

exports.__esModule = true;
exports.imageLoaded = exports.imageReferenceCompleted = exports.createDummyImageArray = exports.imageArrayPropsChanged = exports.imagePropsChanged = exports.getUrlString = exports.getCurrentFromData = exports.createArtDirectionSources = exports.hasPictureElement = void 0;

var _HelperUtils = require("./HelperUtils");

var hasPictureElement = function hasPictureElement() {
  return typeof HTMLPictureElement !== "undefined" || typeof window === "undefined";
};
/**
 * Creates a source Array from media objects.
 *
 * @param fluid
 * @param fixed
 * @return {*}
 */


exports.hasPictureElement = hasPictureElement;

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
 * Extracts a value from an imageRef, image object or an array of them.
 *
 * @param data        HTMLImageElement||object||Array   Data to extract from.
 * @param propName    string    Property to extract.
 * @param addUrl      boolean   Should returned strings be encased in `url()`?
 * @param returnArray boolean   Switches between returning an array and a string.
 * @param checkLoaded boolean   Turns checking for imageLoaded() on and off.
 * @return {string||array}
 */


exports.createArtDirectionSources = createArtDirectionSources;

var getCurrentFromData = function getCurrentFromData(_ref2) {
  var data = _ref2.data,
      propName = _ref2.propName,
      _ref2$addUrl = _ref2.addUrl,
      addUrl = _ref2$addUrl === void 0 ? true : _ref2$addUrl,
      _ref2$returnArray = _ref2.returnArray,
      returnArray = _ref2$returnArray === void 0 ? false : _ref2$returnArray,
      _ref2$checkLoaded = _ref2.checkLoaded,
      checkLoaded = _ref2$checkLoaded === void 0 ? true : _ref2$checkLoaded;
  if (!data || !propName) return ""; // Handle tracedSVG with "special care".

  var tracedSVG = propName === "tracedSVG";

  if (Array.isArray(data) && !(0, _HelperUtils.hasArtDirectionArray)({
    fluid: data
  })) {
    // Filter out all elements not having the propName and return remaining.
    var imageString = data // .filter(dataElement => {
    //   return propName in dataElement && dataElement[propName]
    // })
    .map(function (dataElement) {
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

  if ((0, _HelperUtils.hasArtDirectionArray)({
    fluid: data
  }) && (propName === "currentSrc" || propName === 'src')) {
    var currentData = (0, _HelperUtils.getCurrentSrcData)({
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
 * Encapsulates an imageString with a url if needed.
 *
 * @param imageString   string    String to encapsulate.
 * @param tracedSVG     boolean   Special care for SVGs.
 * @param addUrl        boolean   If the string should be encapsulated or not.
 * @param returnArray   boolean   Return concatenated string or Array.
 * @param hasImageUrls  boolean   Force return of quoted string(s) for url().
 * @return {string||array}
 */


exports.getCurrentFromData = getCurrentFromData;

var getUrlString = function getUrlString(_ref3) {
  var imageString = _ref3.imageString,
      _ref3$tracedSVG = _ref3.tracedSVG,
      tracedSVG = _ref3$tracedSVG === void 0 ? false : _ref3$tracedSVG,
      _ref3$addUrl = _ref3.addUrl,
      addUrl = _ref3$addUrl === void 0 ? true : _ref3$addUrl,
      _ref3$returnArray = _ref3.returnArray,
      returnArray = _ref3$returnArray === void 0 ? false : _ref3$returnArray,
      _ref3$hasImageUrls = _ref3.hasImageUrls,
      hasImageUrls = _ref3$hasImageUrls === void 0 ? false : _ref3$hasImageUrls;

  if (Array.isArray(imageString)) {
    var stringArray = imageString.map(function (currentString) {
      if (currentString) {
        var _base = currentString.indexOf("base64") !== -1;

        var _imageUrl = hasImageUrls || currentString.substr(0, 4) === "http";

        var currentReturnString = currentString && tracedSVG ? "\"" + currentString + "\"" : currentString && !_base && !tracedSVG && _imageUrl ? "'" + currentString + "'" : currentString;
        return addUrl && currentString ? "url(" + currentReturnString + ")" : currentReturnString;
      }

      return currentString;
    });
    return returnArray ? stringArray : (0, _HelperUtils.filteredJoin)(stringArray);
  }

  var base64 = imageString.indexOf("base64") !== -1;
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
  var isPropsFluidArray = Array.isArray(props.fluid);
  var isPrevPropsFluidArray = Array.isArray(prevProps.fluid);
  var isPropsFixedArray = Array.isArray(props.fixed);
  var isPrevPropsFixedArray = Array.isArray(prevProps.fixed);

  if ( // Did the props change to a single image?
  isPropsFluidArray && !isPrevPropsFluidArray || isPropsFixedArray && !isPrevPropsFixedArray || // Did the props change to an Array?
  !isPropsFluidArray && isPrevPropsFluidArray || !isPropsFixedArray && isPrevPropsFixedArray) {
    return true;
  } // Are the lengths or sources in the Arrays different?


  if (isPropsFluidArray && isPrevPropsFluidArray) {
    if (props.fluid.length === prevProps.fluid.length) {
      // Check for individual image or CSS string changes.
      return props.fluid.some(function (image, index) {
        return image.src !== prevProps.fluid[index].src;
      });
    }

    return true;
  } else if (isPropsFixedArray && isPrevPropsFixedArray) {
    if (props.fixed.length === prevProps.fixed.length) {
      // Check for individual image or CSS string changes.
      return props.fixed.some(function (image, index) {
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
  var DUMMY_IMG = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
  var dummyImageURI = getUrlString({
    imageString: DUMMY_IMG
  });
  return Array(length).fill(dummyImageURI);
};
/**
 * Checks if an image (array) reference is existing and tests for complete.
 *
 * @param imageRef    HTMLImageElement||array   Image reference(s).
 * @return {boolean}
 */


exports.createDummyImageArray = createDummyImageArray;

var imageReferenceCompleted = function imageReferenceCompleted(imageRef) {
  return imageRef ? Array.isArray(imageRef) ? imageRef.every(function (singleImageRef) {
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