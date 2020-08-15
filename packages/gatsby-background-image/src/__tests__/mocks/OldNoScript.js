const noScriptImages = createNoScriptImages({
  alt,
  title,
  ...(divStyle.width && divStyle.width),
  ...(divStyle.height && divStyle.height),
  backgroundStyles: this.backgroundStyles,
  image,
});

/**
 * Create multiple or singular noscript Images.
 *
 * @param props
 * @return {string}
 */
export const createNoScriptImages = props => {
  if (Array.isArray(props.image)) {
    const opacity = props.opacity ? props.opacity : `1`;
    const zIndex = props.image.length;
    return props.image
      .reverse()
      .map((data, index) => {
        if (isString(data)) {
          return `<div style="position:absolute;top:0;left:0;z-index:-${
            zIndex - index
          };opacity:${opacity};width:100%;height:100%;background:${data}"></div>`;
        }
        return noscriptImg({ ...props, ...data, zIndex: -(zIndex - index) });
      })
      .join(`\n`);
  }

  return noscriptImg({ ...props, ...props.image });
};

/**
 * Create basic image for a noscript event.
 *
 * @param props
 * @return {string}
 */
export const noscriptImg = props => {
  // Check if prop exists before adding each attribute to the string output below to prevent
  // HTML validation issues caused by empty values like width="" and height=""
  const src = props.src ? `src="${props.src}" ` : `src="" `; // required attribute
  const sizes = props.sizes ? `sizes="${props.sizes}" ` : ``;
  const srcSetWebp = props.srcSetWebp
    ? `<source type='image/webp' srcset="${props.srcSetWebp}" ${sizes}/>`
    : ``;
  const srcSet = props.srcSet ? `srcset="${props.srcSet}" ` : ``;
  const title = props.title ? `title="${props.title}" ` : ``;
  const alt = props.alt ? `alt="${props.alt}" ` : `alt="" `; // required attribute
  const width = props.width ? `width="${props.width}" ` : ``;
  const height = props.height ? `height="${props.height}" ` : ``;
  const opacity = props.opacity ? props.opacity : `1`;
  const transitionDelay = props.transitionDelay
    ? props.transitionDelay
    : `0.5s`;
  const crossOrigin = props.crossOrigin
    ? `crossorigin="${props.crossOrigin}" `
    : ``;
  const zIndex = props.zIndex ? props.zIndex : -1;

  // Prevent adding HTMLPictureElement if it isn't supported (e.g. IE11),
  // but don't prevent it during SSR.
  const innerImage = `<img ${width}${height}${sizes}${srcSet}${src}${alt}${title}${crossOrigin}style="position:absolute;top:0;left:0;z-index:${zIndex};transition:opacity 0.5s;transition-delay:${transitionDelay};opacity:${opacity};width:100%;height:100%;object-fit:cover;object-position:center"/>`;
  return hasPictureElement()
    ? `<picture>${srcSetWebp}${innerImage}</picture>`
    : innerImage;
};
