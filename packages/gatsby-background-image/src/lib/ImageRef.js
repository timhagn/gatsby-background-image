import { convertProps } from './HelperUtils';
import {
  getCurrentSrcData,
  getSelectedImage,
  hasImageArray,
  hasPictureElement,
  imageLoaded,
} from './ImageUtils';
import { createArtDirectionSources, hasArtDirectionArray } from './MediaUtils';
import { isBrowser, isString } from './SimpleUtils';
import { inImageCache } from './ImageCache';

/**
 * Creates an image reference to be activated on critical or visibility.
 * @param props
 * @param onLoad
 * @param index
 * @param isLoop
 * @return {HTMLImageElement|null|Array}
 */
export const createPictureRef = (props, onLoad, index, isLoop = false) => {
  const convertedProps = convertProps(props);

  if (
    isBrowser() &&
    (typeof convertedProps.fluid !== `undefined` ||
      typeof convertedProps.fixed !== `undefined`)
  ) {
    const isImageStack =
      hasImageArray(convertedProps) && !hasArtDirectionArray(convertedProps);
    if (isImageStack && !isLoop) {
      return createMultiplePictureRefs(props, onLoad);
    }
    const img = new Image();

    if (typeof convertedProps.onLoad === `function`) {
      img.onload = () => onLoad();
    }

    if (!img.complete && typeof convertedProps.onLoad === `function`) {
      img.addEventListener('load', convertedProps.onLoad);
    }
    if (typeof convertedProps.onError === `function`) {
      img.addEventListener('error', convertedProps.onError);
    }
    if (convertedProps.crossOrigin) {
      img.crossOrigin = convertedProps.crossOrigin;
    }

    // Only directly activate the image if critical (preload).
    if ((convertedProps.critical || convertedProps.isVisible) && !isLoop) {
      return activatePictureRef(img, convertedProps, index, isLoop);
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
export const createMultiplePictureRefs = (props, onLoad) => {
  const convertedProps = convertProps(props);

  // Extract Image Array.
  const imageStack = convertedProps.fluid || convertedProps.fixed;
  const imageRefs = imageStack.map((imageData, index) =>
    createPictureRef(convertedProps, onLoad, index, true)
  );
  // Only directly activate the image if critical (preload).
  if (convertedProps.critical || convertedProps.isVisible) {
    return activatePictureRef(imageRefs, convertedProps);
  }
  return imageRefs;
};

/**
 * Creates a picture element for the browser to decide which image to load.
 *
 * @param imageRef
 * @param props
 * @param selfRef
 * @param index
 * @param isLoop
 * @return {null|Array|*}
 */
export const activatePictureRef = (
  imageRef,
  props,
  selfRef = null,
  index = 0,
  isLoop = false
) => {
  const convertedProps = convertProps(props);
  if (
    isBrowser() &&
    (typeof convertedProps.fluid !== `undefined` ||
      typeof convertedProps.fixed !== `undefined`)
  ) {
    const isImageStack =
      hasImageArray(convertedProps) && !hasArtDirectionArray(convertedProps);
    if (isImageStack && !isLoop) {
      return activateMultiplePictureRefs(imageRef, props, selfRef);
    }
    // Clone body to get the correct sizes.
    // const bodyClone = document.body.cloneNode(true)
    const bodyClone = document.createElement('body');
    // Do we have an image stack or Art-direction array?
    // Then get its current or first(smallest) image respectively.
    const imageData = isImageStack
      ? getSelectedImage(convertedProps, index)
      : getCurrentSrcData(convertedProps);

    if (!imageData) {
      return null;
    }
    if (isString(imageData)) {
      return imageData;
    }

    // Prevent adding HTMLPictureElement if it isn't supported (e.g. IE11),
    // but don't prevent it during SSR.
    if (hasPictureElement()) {
      const pic = document.createElement('picture');
      if (selfRef) {
        // Set original component's style.
        imageRef.width = selfRef.offsetWidth;
        imageRef.height = selfRef.offsetHeight;
        pic.width = imageRef.width;
        pic.height = imageRef.height;
      }
      // TODO: check why only the 1400 image gets loaded as jpg & single / stacked images don't!
      if (hasArtDirectionArray(convertedProps)) {
        const sources = createArtDirectionSources(convertedProps).reverse();
        sources.forEach(currentSource => pic.appendChild(currentSource));
      }
      if (imageData.srcSetWebp) {
        const sourcesWebP = document.createElement('source');
        sourcesWebP.type = `image/webp`;
        sourcesWebP.srcset = imageData.srcSetWebp;
        sourcesWebP.sizes = imageData.sizes;
        pic.appendChild(sourcesWebP);
      }
      pic.appendChild(imageRef);
      bodyClone.appendChild(pic);
    } else if (selfRef) {
      imageRef.width = selfRef.offsetWidth;
      imageRef.height = selfRef.offsetHeight;
    }

    imageRef.sizes = imageData.sizes || ``;
    imageRef.srcset = imageData.srcSet || ``;
    imageRef.src = imageData.src || ``;

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
export const activateMultiplePictureRefs = (imageRefs, props, selfRef) => {
  // Extract Image Array.
  return imageRefs.map((imageRef, index) =>
    activatePictureRef(imageRef, props, selfRef, index, true)
  );
};

/**
 * Checks imageRefs on being active.
 *
 * @param imageRefs
 * @return {*}
 */
export const hasActivatedPictureRefs = imageRefs => {
  return Array.isArray(imageRefs)
    ? imageRefs.every(imageRef => hasPictureRef(imageRef))
    : hasPictureRef(imageRefs);
};

/**
 * Checks imageRef for on being a string or has a currentSrc.
 *
 * @param imageRef
 * @return {boolean}
 */
export const hasPictureRef = imageRef => {
  return isString(imageRef) || (!!imageRef && !!imageRef.currentSrc);
};

/**
 * Checks if an image (array) reference is existing and tests for complete.
 *
 * @param imageRef    HTMLImageElement||array   Image reference(s).
 * @param props
 * @return {boolean}
 */
export const imageReferenceCompleted = (imageRef, props) =>
  imageRef
    ? Array.isArray(imageRef)
      ? imageRef.every(singleImageRef => imageLoaded(singleImageRef)) ||
        inImageCache(props)
      : imageLoaded(imageRef) || inImageCache(props)
    : isString(imageRef);
