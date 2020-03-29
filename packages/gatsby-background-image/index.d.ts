import * as React from 'react'

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
    media?: string
  }

  interface IFluidObject {
    aspectRatio: number
    src: string
    srcSet: string
    sizes?: string
    base64?: string
    tracedSVG?: string
    srcWebp?: string
    srcSetWebp?: string
    media?: string
  }

  type IntrinsicTags = keyof JSX.IntrinsicElements;
  type DefaultExtraProps = { Tag?: 'div' } & JSX.IntrinsicElements['div'];
  type InferExtraProps<T extends IntrinsicTags | void> = T extends infer U
    ? U extends IntrinsicTags
    ? U extends 'div'
    ? DefaultExtraProps
    : { Tag: U } & JSX.IntrinsicElements[U]
    : DefaultExtraProps
    : DefaultExtraProps
    ;

  interface IBackgroundImageProps {
    fixed?: IFixedObject | IFixedObject[] | (IFixedObject | string)[],
    fluid?: IFluidObject | IFluidObject[] | (IFluidObject | string)[],
    fadeIn?: string | boolean,
    durationFadeIn?: number,
    title?: string,
    alt?: string
    critical?: boolean,
    crossOrigin?: string | boolean,
    backgroundColor?: string | boolean,
    onLoad?: () => void
    onStartLoad?: (param: { wasCached: boolean }) => void
    onError?: (event: any) => void
    preserveStackingContext?: boolean,
    rootMargin?: string,
  }

  export default class BackgroundImage<T extends IntrinsicTags> extends React.Component<InferExtraProps<T> & IBackgroundImageProps> {
  }
}
