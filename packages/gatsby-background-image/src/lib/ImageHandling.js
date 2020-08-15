import { createDummyImageArray, getCurrentFromData } from './ImageUtils';
import { hasArtDirectionArray } from './MediaUtils';
import { combineArray, filteredJoin } from './SimpleUtils';

/**
 * Compares the old states to the new and changes image settings accordingly.
 *
 * @param image     string||array   Base data for one or multiple Images.
 * @param bgImage   string||array   Last background image(s).
 * @param imageRef  string||array   References to one or multiple Images.
 * @param state     object          Component state.
 * @return {{afterOpacity: number, bgColor: *, bgImage: *, nextImage: string}}
 */
// eslint-disable-next-line import/prefer-default-export
export const switchImageSettings = ({ image, bgImage, imageRef, state }) => {
  // Read currentSrc from imageRef (if exists).
  const currentSources = getCurrentFromData({
    data: imageRef,
    propName: `currentSrc`,
  });
  // Check if image is Array.
  const returnArray =
    Array.isArray(image) && !hasArtDirectionArray({ fluid: image });
  // Backup bgImage to lastImage.
  const lastImage = Array.isArray(bgImage) ? filteredJoin(bgImage) : bgImage;
  // Set the backgroundImage according to images available.
  let nextImage;
  let nextImageArray;
  // Signal to `createPseudoStyles()` when we have reached the final image,
  // which is important for transparent background-image(s).
  let finalImage = false;
  if (returnArray) {
    // Check for tracedSVG first.
    nextImage = getCurrentFromData({
      data: image,
      propName: `tracedSVG`,
      returnArray,
    });
    // Now combine with base64 images.
    nextImage = combineArray(
      getCurrentFromData({
        data: image,
        propName: `base64`,
        returnArray,
      }),
      nextImage
    );
    // Now add possible `rgba()` or similar CSS string props.
    nextImage = combineArray(
      getCurrentFromData({
        data: image,
        propName: `CSS_STRING`,
        addUrl: false,
        returnArray,
      }),
      nextImage
    );
    // Do we have at least one img loaded?
    if (state.imgLoaded && state.isVisible) {
      if (currentSources) {
        nextImage = combineArray(
          getCurrentFromData({
            data: imageRef,
            propName: `currentSrc`,
            returnArray,
          }),
          nextImage
        );
        finalImage = true;
      } else {
        // No support for HTMLPictureElement or WebP present, get src.
        nextImage = combineArray(
          getCurrentFromData({
            data: imageRef,
            propName: `src`,
            returnArray,
          }),
          nextImage
        );
        finalImage = true;
      }
    }
    // First fill last images from bgImage...
    nextImage = combineArray(nextImage, bgImage);
    // ... then fill the rest of the background-images with a transparent dummy
    // pixel, lest the background-* properties can't target the correct image.
    const dummyArray = createDummyImageArray(image.length);
    // Now combine the two arrays and join them.
    nextImage = combineArray(nextImage, dummyArray);
    nextImageArray = nextImage;
    nextImage = filteredJoin(nextImage);
  } else {
    nextImage = ``;
    nextImage =
      getCurrentFromData({ data: image, propName: `tracedSVG` }) ||
      getCurrentFromData({ data: image, propName: `base64` });
    if (state.imgLoaded && state.isVisible) {
      nextImage = currentSources;
      finalImage = true;
    }
  }

  // Change opacity according to imageState.
  const afterOpacity = state.imageState % 2;

  if (
    !returnArray &&
    nextImage === `` &&
    state.imgLoaded &&
    state.isVisible &&
    imageRef &&
    !imageRef.currentSrc
  ) {
    // Should we still have no nextImage it might be because currentSrc is missing.
    nextImage = getCurrentFromData({
      data: imageRef,
      propName: `src`,
      checkLoaded: false,
    });
    finalImage = true;
  }
  // Fall back on lastImage (important for prop changes) if all else fails.
  if (!nextImage) nextImage = lastImage;

  const newImageSettings = {
    lastImage,
    nextImage,
    afterOpacity,
    finalImage,
  };
  // Add nextImageArray for bgImage to newImageSettings if exists.
  if (nextImageArray) newImageSettings.nextImageArray = nextImageArray;
  return newImageSettings;
};
