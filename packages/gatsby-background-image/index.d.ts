import React from 'react'

declare module 'gatsby-background-image' {
  interface IFixedObject {
    width: number
    height: number
    src: string
    srcSet: string
    base64?: string
    tracedSVG?: string
    srcWebp?: string
    srcSetWebp?: string
  }

  interface IFluidObject {
    aspectRatio: number
    src: string
    srcSet: string
    sizes: string
    base64?: string
    tracedSVG?: string
    srcWebp?: string
    srcSetWebp?: string
  }

  interface IBackgroundImageProps {
    resolutions?: IFixedObject | (IFixedObject | string)[],
    sizes?: IFluidObject | (IFluidObject | string)[],
    fixed?: IFixedObject | (IFixedObject | string)[],
    fluid?: IFluidObject | (IFluidObject | string)[],
    fadeIn?: string | boolean,
    durationFadeIn?: number,
    title?: string,
    alt?: string
    className?: string | object, // Support Glamor's css prop?.
    critical?: boolean,
    crossOrigin?: string | boolean,
    style?: object | [], // Using PropTypes from RN. (not 100% sure of array type here)
    backgroundColor?: string | boolean,
    onLoad?: () => void
    onStartLoad?: (param: { wasCached: boolean }) => void
    onError?: (event: any) => void
    Tag?: string,
    classId?: string,
    preserveStackingContext?: boolean,
  }

  export default class BackgroundImage extends React.Component<IBackgroundImageProps> {
  }
}
