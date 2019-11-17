"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.imageLoaded = exports.imageReferenceCompleted = exports.createDummyImageArray = exports.initialBgImage = exports.imageArrayPropsChanged = exports.imagePropsChanged = exports.getUrlString = exports.getCurrentFromData = exports.switchImageSettings = exports.activateMultiplePictureRefs = exports.createArtDirectionSources = exports.activatePictureRef = exports.createMultiplePictureRefs = exports.createPictureRef = exports.hasPictureElement = exports.resetImageCache = exports.activateCacheForMultipleImages = exports.activateCacheForImage = exports.allInImageCache = exports.inImageCache = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _HelperUtils = require("./HelperUtils");

var imageCache = Object.create({});
/**
 * Cache if we've seen an image before so we don't both with
 * lazy-loading & fading in on subsequent mounts.
 *
 * @param props
 * @return {boolean}
 */

var inImageCache = function inImageCache(props) {
  var convertedProps = (0, _HelperUtils.convertProps)(props);

  if ((0, _HelperUtils.hasImageArray)(convertedProps) && !(0, _HelperUtils.hasArtDirectionArray)(convertedProps)) {
    return allInImageCache(props);
  } // Find src


  var src = (0, _HelperUtils.getImageSrcKey)(convertedProps);
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

  return imageStack.every(function (imageData) {
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


  var src = (0, _HelperUtils.getImageSrcKey)(convertedProps);

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
  imageStack.forEach(function (imageData) {
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
/**
 * Returns the availability of the HTMLPictureElement unless in SSR mode.
 *
 * @return {boolean}
 */


exports.resetImageCache = resetImageCache;

var hasPictureElement = function hasPictureElement() {
  return typeof HTMLPictureElement !== "undefined" || typeof window === "undefined";
};
/**
 * Creates an image reference to be activated on critical or visibility.
 * @param props
 * @param onLoad
 * @return {HTMLImageElement|null|Array}
 */


exports.hasPictureElement = hasPictureElement;

var createPictureRef = function createPictureRef(props, onLoad) {
  var convertedProps = (0, _HelperUtils.convertProps)(props);

  if ((0, _HelperUtils.isBrowser)() && (typeof convertedProps.fluid !== "undefined" || typeof convertedProps.fixed !== "undefined")) {
    if ((0, _HelperUtils.hasImageArray)(convertedProps) && !(0, _HelperUtils.hasArtDirectionArray)(convertedProps)) {
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

  if ((0, _HelperUtils.isBrowser)() && (typeof convertedProps.fluid !== "undefined" || typeof convertedProps.fixed !== "undefined")) {
    if ((0, _HelperUtils.hasImageArray)(convertedProps) && !(0, _HelperUtils.hasArtDirectionArray)(convertedProps)) {
      return activateMultiplePictureRefs(imageRef, props, selfRef);
    } else {
      var imageData = (0, _HelperUtils.hasArtDirectionArray)(convertedProps) ? (0, _HelperUtils.getCurrentSrcData)(convertedProps) : getCurrentFromData(convertedProps); // Prevent adding HTMLPictureElement if it isn't supported (e.g. IE11),
      // but don't prevent it during SSR.

      var removableElement = null;

      if (hasPictureElement()) {
        var pic = document.createElement('picture');

        if (selfRef) {
          // Set original component's style.
          pic.width = imageRef.width = selfRef.offsetWidth;
          pic.height = imageRef.height = selfRef.offsetHeight;
        } // TODO: check why only the 1400 image gets loaded & single / stacked images don't!


        if ((0, _HelperUtils.hasArtDirectionArray)(convertedProps)) {
          var sources = createArtDirectionSources(convertedProps);
          sources.forEach(function (currentSource) {
            return pic.appendChild(currentSource);
          });
        } else if (imageData.srcSetWebp) {
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
        removableElement = pic; // document.body.appendChild(removableElement)
      } else {
        if (selfRef) {
          imageRef.width = selfRef.offsetWidth;
          imageRef.height = selfRef.offsetHeight;
        }

        removableElement = imageRef; // document.body.appendChild(removableElement)
      }

      imageRef.srcset = imageData.srcSet ? imageData.srcSet : "";
      imageRef.src = imageData.src ? imageData.src : "";

      if (imageData.media) {
        imageRef.media = imageData.media;
      } // document.body.removeChild(removableElement)


      return imageRef;
    }
  }

  return null;
};
/**
 * Creates a source Array from media objects.
 *
 * @param fluid
 * @param fixed
 * @return {*}
 */


exports.activatePictureRef = activatePictureRef;

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
 * Creates multiple picture elements.
 *
 * @param imageRefs
 * @param props
 * @param selfRef
 * @return {Array||null}
 */


exports.createArtDirectionSources = createArtDirectionSources;

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
/**
 * Compares the old states to the new and changes image settings accordingly.
 *
 * @param image     string||array   Base data for one or multiple Images.
 * @param bgImage   string||array   Last background image(s).
 * @param imageRef  string||array   References to one or multiple Images.
 * @param state     object          Component state.
 * @return {{afterOpacity: number, bgColor: *, bgImage: *, nextImage: string}}
 */


exports.activateMultiplePictureRefs = activateMultiplePictureRefs;

var switchImageSettings = function switchImageSettings(_ref2) {
  var image = _ref2.image,
      bgImage = _ref2.bgImage,
      imageRef = _ref2.imageRef,
      state = _ref2.state;
  // Read currentSrc from imageRef (if exists).
  var currentSources = getCurrentFromData({
    data: imageRef,
    propName: "currentSrc"
  }); // Check if image is Array.

  var returnArray = Array.isArray(image) && !(0, _HelperUtils.hasArtDirectionArray)({
    fluid: image
  }); // Backup bgImage to lastImage.

  var lastImage = Array.isArray(bgImage) ? (0, _HelperUtils.filteredJoin)(bgImage) : bgImage; // Set the backgroundImage according to images available.

  var nextImage;
  var nextImageArray; // Signal to `createPseudoStyles()` when we have reached the final image,
  // which is important for transparent background-image(s).

  var finalImage = false;

  if (returnArray) {
    // Check for tracedSVG first.
    nextImage = getCurrentFromData({
      data: image,
      propName: "tracedSVG",
      returnArray: returnArray
    }); // Now combine with base64 images.

    nextImage = (0, _HelperUtils.combineArray)(getCurrentFromData({
      data: image,
      propName: "base64",
      returnArray: returnArray
    }), nextImage); // Now add possible `rgba()` or similar CSS string props.

    nextImage = (0, _HelperUtils.combineArray)(getCurrentFromData({
      data: image,
      propName: "CSS_STRING",
      addUrl: false,
      returnArray: returnArray
    }), nextImage); // Do we have at least one img loaded?

    if (state.imgLoaded && state.isVisible) {
      if (currentSources) {
        nextImage = (0, _HelperUtils.combineArray)(getCurrentFromData({
          data: imageRef,
          propName: "currentSrc",
          returnArray: returnArray
        }), nextImage);
        finalImage = true;
      } else {
        // No support for HTMLPictureElement or WebP present, get src.
        nextImage = (0, _HelperUtils.combineArray)(getCurrentFromData({
          data: imageRef,
          propName: "src",
          returnArray: returnArray
        }), nextImage);
        finalImage = true;
      }
    } // First fill last images from bgImage...


    nextImage = (0, _HelperUtils.combineArray)(nextImage, bgImage); // ... then fill the rest of the background-images with a transparent dummy
    // pixel, lest the background-* properties can't target the correct image.

    var dummyArray = createDummyImageArray(image.length); // Now combine the two arrays and join them.

    nextImage = (0, _HelperUtils.combineArray)(nextImage, dummyArray);
    nextImageArray = nextImage;
    nextImage = (0, _HelperUtils.filteredJoin)(nextImage);
  } else {
    nextImage = "";
    if (image.tracedSVG) nextImage = getCurrentFromData({
      data: image,
      propName: "tracedSVG"
    });
    if (image.base64 && !image.tracedSVG) nextImage = getCurrentFromData({
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
    nextImage = getCurrentFromData({
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
 * Extracts a value from an imageRef, image object or an array of them.
 *
 * @param data        HTMLImageElement||object||Array   Data to extract from.
 * @param propName    string    Property to extract.
 * @param addUrl      boolean   Should returned strings be encased in `url()`?
 * @param returnArray boolean   Switches between returning an array and a string.
 * @param checkLoaded boolean   Turns checking for imageLoaded() on and off.
 * @return {string||array}
 */


exports.switchImageSettings = switchImageSettings;

var getCurrentFromData = function getCurrentFromData(_ref3) {
  var data = _ref3.data,
      propName = _ref3.propName,
      _ref3$addUrl = _ref3.addUrl,
      addUrl = _ref3$addUrl === void 0 ? true : _ref3$addUrl,
      _ref3$returnArray = _ref3.returnArray,
      returnArray = _ref3$returnArray === void 0 ? false : _ref3$returnArray,
      _ref3$checkLoaded = _ref3.checkLoaded,
      checkLoaded = _ref3$checkLoaded === void 0 ? true : _ref3$checkLoaded;
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
 * Prepares initial background image(s).
 *
 * @param props         object    Component properties.
 * @param withDummies   boolean   If array preserving bg layering should be add.
 * @return {string|(string|Array)}
 */


exports.imageArrayPropsChanged = imageArrayPropsChanged;

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
    initialImage = getCurrentFromData({
      data: image,
      propName: "tracedSVG",
      returnArray: returnArray
    }); // Now combine with base64 images.

    initialImage = (0, _HelperUtils.combineArray)(getCurrentFromData({
      data: image,
      propName: "base64",
      returnArray: returnArray
    }), initialImage); // Now add possible `rgba()` or similar CSS string props.

    initialImage = (0, _HelperUtils.combineArray)(getCurrentFromData({
      data: image,
      propName: "CSS_STRING",
      addUrl: false,
      returnArray: returnArray
    }), initialImage);

    if (withDummies) {
      var dummyArray = createDummyImageArray(image.length); // Now combine the two arrays and join them.

      initialImage = (0, _HelperUtils.combineArray)(initialImage, dummyArray);
    }
  } else {
    initialImage = "";
    if (image.tracedSVG) initialImage = getCurrentFromData({
      data: image,
      propName: "tracedSVG"
    });
    if (image.base64 && !image.tracedSVG) initialImage = getCurrentFromData({
      data: image,
      propName: "base64"
    });
  }

  return initialImage;
};
/**
 * Creates an array with a transparent dummy pixel for background-* properties.
 *
 * @param length
 * @return {any[]}
 */


exports.initialBgImage = initialBgImage;

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