import { IGatsbyImageData } from 'gatsby-plugin-image/dist/src/components/gatsby-image.browser';
import * as React from 'react';
import { render } from '@testing-library/react';
import {
  BgImage,
  convertToBgImage,
  getAllExtraSrcSets,
  getPlaceholder,
  getSrc,
} from '../index';

// MOCKS

const newFormatConstrainedMock: IGatsbyImageData = {
  layout: 'constrained',
  placeholder: {
    fallback:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAPCAYAAADkmO9VAAAACXBIWXMAAAsTAAALEwEAmpwYAAADLUlEQVQ4y2NgoADsWDuJYV53EcOC5iCGzUvbGCZPmkW+Ye+fX2DYtLyHYemUKob///8zbFnWwbR1wwomigx8ducUw8E9OxnuXT/BcP74fpYzxw8xM1hZWqBgUgz8//8Fw/3bFxn+fLrAeO7UEbbHd24wMdjaWoMVFOZmMPR2NDIc2b2BoGFGBtpAw36Bvbp6yWSG7++v865c1M+2Yt4cHoboyGBGkMSk3jaGdcvnMVw+tZ+ggaxsEgycXBJAlgqYD9IfEuAjunj2NF0Qn3FSTysTSPD//+8M96+dYuDj4yPS48oM0/syGPZtW8G8YfUCnvWrlioynDi0im3L6oWsK+dPY9y6ZhHD8T0bGeTl5HAaoSQjyWBlocdgaa4LooUsTLWFgY5hzclIYOpsbuRmOLNvrYCHqyPb5AltYA3CQkIMIsLCDCwszNgNlJVicLIzZHAEYhdHYzZXJyM2Xy93RqAUc15mDDdDb2M+e3x0JJucnBwHMzMzSIJBUV6eIScpnqEiL5vBSE8XiHXA2FBXl8EUGCF6WooM2uoKDGIibAzK8orMooLcbL2dHVyzJ/dKMKioyEuDQ0NJAeyk/z8/M1iZGTA4A5OQv4sTg7G+LoO2hgaDCdBAUDj3VRUxZGfEM6goyDIK8nDyK8pIsQsJCvC31JTzbFy2UJxBSEiQR0RQHBzTAvx8TEa62syGuhoMutYmDJuXz2cQFxZh0FBTY9DXVAe7fmF3E4O+jjpDUVE+w9JFs7namutYLc3NRcqKctkCA/zBUc4S5OvAuWjeDBZzQx3m49s3CEYG+XCANJ/Yu4WBk0OQwcrEiMFIX1/w8LJVTEv62rhVlOS5XJwcWLduWim4fv0qNltra5as9GQBYWEhQYand2+zJMUGsuhoqQsDncD28t4l3o76Ms6/Tx8yXDi6mx2crthZGBQV5fjzkqI4ty6YINdUmqHkam/Fqq0qz+liZ8bf0VDOHxkWLAWMB1GGid2dkMTKwiTCz8fNLycjxSAnI82hrKgg1l5TJnBy/xrmWZOaGWRlxNgdbIzY2yoyxeb21oqoqyqwebvactlZGiskx4TwwlIBAPhL/1n+gpVRAAAAAElFTkSuQmCC',
  },
  images: {
    fallback: {
      src: '/static/f6ae9d60c37065f389a04cb5ff400156/2c67b/bubbles.png',
      srcSet:
        '/static/f6ae9d60c37065f389a04cb5ff400156/6e317/bubbles.png 50w,\n/static/f6ae9d60c37065f389a04cb5ff400156/4e4d4/bubbles.png 100w,\n/static/f6ae9d60c37065f389a04cb5ff400156/2c67b/bubbles.png 200w,\n/static/f6ae9d60c37065f389a04cb5ff400156/6addd/bubbles.png 400w',
      sizes: '(min-width: 200px) 200px, 100vw',
    },
    sources: [
      {
        srcSet:
          '/static/f6ae9d60c37065f389a04cb5ff400156/5cff3/bubbles.avif 50w,\n/static/f6ae9d60c37065f389a04cb5ff400156/82098/bubbles.avif 100w,\n/static/f6ae9d60c37065f389a04cb5ff400156/1aafe/bubbles.avif 200w,\n/static/f6ae9d60c37065f389a04cb5ff400156/6707c/bubbles.avif 400w',
        type: 'image/avif',
        sizes: '(min-width: 200px) 200px, 100vw',
      },
      {
        srcSet:
          '/static/f6ae9d60c37065f389a04cb5ff400156/1a81d/bubbles.webp 50w,\n/static/f6ae9d60c37065f389a04cb5ff400156/f6ea0/bubbles.webp 100w,\n/static/f6ae9d60c37065f389a04cb5ff400156/b5535/bubbles.webp 200w,\n/static/f6ae9d60c37065f389a04cb5ff400156/f5c71/bubbles.webp 400w',
        type: 'image/webp',
        sizes: '(min-width: 200px) 200px, 100vw',
      },
    ],
  },
  width: 200,
  height: 150,
};

const convertedFluidMock = {
  fluid: {
    aspectRatio: 1.3333333333333333,
    base64:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAPCAYAAADkmO9VAAAACXBIWXMAAAsTAAALEwEAmpwYAAADLUlEQVQ4y2NgoADsWDuJYV53EcOC5iCGzUvbGCZPmkW+Ye+fX2DYtLyHYemUKob///8zbFnWwbR1wwomigx8ducUw8E9OxnuXT/BcP74fpYzxw8xM1hZWqBgUgz8//8Fw/3bFxn+fLrAeO7UEbbHd24wMdjaWoMVFOZmMPR2NDIc2b2BoGFGBtpAw36Bvbp6yWSG7++v865c1M+2Yt4cHoboyGBGkMSk3jaGdcvnMVw+tZ+ggaxsEgycXBJAlgqYD9IfEuAjunj2NF0Qn3FSTysTSPD//+8M96+dYuDj4yPS48oM0/syGPZtW8G8YfUCnvWrlioynDi0im3L6oWsK+dPY9y6ZhHD8T0bGeTl5HAaoSQjyWBlocdgaa4LooUsTLWFgY5hzclIYOpsbuRmOLNvrYCHqyPb5AltYA3CQkIMIsLCDCwszNgNlJVicLIzZHAEYhdHYzZXJyM2Xy93RqAUc15mDDdDb2M+e3x0JJucnBwHMzMzSIJBUV6eIScpnqEiL5vBSE8XiHXA2FBXl8EUGCF6WooM2uoKDGIibAzK8orMooLcbL2dHVyzJ/dKMKioyEuDQ0NJAeyk/z8/M1iZGTA4A5OQv4sTg7G+LoO2hgaDCdBAUDj3VRUxZGfEM6goyDIK8nDyK8pIsQsJCvC31JTzbFy2UJxBSEiQR0RQHBzTAvx8TEa62syGuhoMutYmDJuXz2cQFxZh0FBTY9DXVAe7fmF3E4O+jjpDUVE+w9JFs7namutYLc3NRcqKctkCA/zBUc4S5OvAuWjeDBZzQx3m49s3CEYG+XCANJ/Yu4WBk0OQwcrEiMFIX1/w8LJVTEv62rhVlOS5XJwcWLduWim4fv0qNltra5as9GQBYWEhQYand2+zJMUGsuhoqQsDncD28t4l3o76Ms6/Tx8yXDi6mx2crthZGBQV5fjzkqI4ty6YINdUmqHkam/Fqq0qz+liZ8bf0VDOHxkWLAWMB1GGid2dkMTKwiTCz8fNLycjxSAnI82hrKgg1l5TJnBy/xrmWZOaGWRlxNgdbIzY2yoyxeb21oqoqyqwebvactlZGiskx4TwwlIBAPhL/1n+gpVRAAAAAElFTkSuQmCC',
    sizes: '(min-width: 200px) 200px, 100vw',
    src: '/static/f6ae9d60c37065f389a04cb5ff400156/2c67b/bubbles.png',
    srcAvif: '/static/f6ae9d60c37065f389a04cb5ff400156/82098/bubbles.avif',
    srcSet:
      '/static/f6ae9d60c37065f389a04cb5ff400156/6e317/bubbles.png 50w,\n/static/f6ae9d60c37065f389a04cb5ff400156/4e4d4/bubbles.png 100w,\n/static/f6ae9d60c37065f389a04cb5ff400156/2c67b/bubbles.png 200w,\n/static/f6ae9d60c37065f389a04cb5ff400156/6addd/bubbles.png 400w',
    srcSetAvif:
      '/static/f6ae9d60c37065f389a04cb5ff400156/5cff3/bubbles.avif 50w,\n/static/f6ae9d60c37065f389a04cb5ff400156/82098/bubbles.avif 100w,\n/static/f6ae9d60c37065f389a04cb5ff400156/1aafe/bubbles.avif 200w,\n/static/f6ae9d60c37065f389a04cb5ff400156/6707c/bubbles.avif 400w',
    srcSetWebp:
      '/static/f6ae9d60c37065f389a04cb5ff400156/1a81d/bubbles.webp 50w,\n/static/f6ae9d60c37065f389a04cb5ff400156/f6ea0/bubbles.webp 100w,\n/static/f6ae9d60c37065f389a04cb5ff400156/b5535/bubbles.webp 200w,\n/static/f6ae9d60c37065f389a04cb5ff400156/f5c71/bubbles.webp 400w',
    srcWebp: '/static/f6ae9d60c37065f389a04cb5ff400156/f6ea0/bubbles.webp',
  },
};

const newFormatFixedMock: IGatsbyImageData = {
  layout: 'fixed',
  placeholder: {
    fallback:
      "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='200'%20height='150'%20viewBox='0%200%20200%20150'%20preserveAspectRatio='none'%3e%3cpath%20d='M190%20127c-3%203-3%206-1%208%204%206%2011%204%2011-2s-5-9-10-6'%20fill='%23d3d3d3'%20fill-rule='evenodd'/%3e%3c/svg%3e",
  },
  images: {
    fallback: {
      src: '/static/f6ae9d60c37065f389a04cb5ff400156/2c67b/bubbles.png',
      srcSet:
        '/static/f6ae9d60c37065f389a04cb5ff400156/2c67b/bubbles.png 200w,\n/static/f6ae9d60c37065f389a04cb5ff400156/6addd/bubbles.png 400w',
      sizes: '200px',
    },
    sources: [
      {
        srcSet:
          '/static/f6ae9d60c37065f389a04cb5ff400156/1aafe/bubbles.avif 200w,\n/static/f6ae9d60c37065f389a04cb5ff400156/6707c/bubbles.avif 400w',
        type: 'image/avif',
        sizes: '200px',
      },
      {
        srcSet:
          '/static/f6ae9d60c37065f389a04cb5ff400156/b5535/bubbles.webp 200w,\n/static/f6ae9d60c37065f389a04cb5ff400156/f5c71/bubbles.webp 400w',
        type: 'image/webp',
        sizes: '200px',
      },
    ],
  },
  width: 200,
  height: 150,
};

const convertedFixedMock = {
  fixed: {
    src: '/static/f6ae9d60c37065f389a04cb5ff400156/2c67b/bubbles.png',
    srcSet:
      '/static/f6ae9d60c37065f389a04cb5ff400156/2c67b/bubbles.png 200w,\n/static/f6ae9d60c37065f389a04cb5ff400156/6addd/bubbles.png 400w',
    sizes: '200px',
    srcSetAvif:
      '/static/f6ae9d60c37065f389a04cb5ff400156/1aafe/bubbles.avif 200w,\n/static/f6ae9d60c37065f389a04cb5ff400156/6707c/bubbles.avif 400w',
    srcAvif: '/static/f6ae9d60c37065f389a04cb5ff400156/1aafe/bubbles.avif',
    srcSetWebp:
      '/static/f6ae9d60c37065f389a04cb5ff400156/b5535/bubbles.webp 200w,\n/static/f6ae9d60c37065f389a04cb5ff400156/f5c71/bubbles.webp 400w',
    srcWebp: '/static/f6ae9d60c37065f389a04cb5ff400156/b5535/bubbles.webp',
    tracedSVG:
      "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='200'%20height='150'%20viewBox='0%200%20200%20150'%20preserveAspectRatio='none'%3e%3cpath%20d='M190%20127c-3%203-3%206-1%208%204%206%2011%204%2011-2s-5-9-10-6'%20fill='%23d3d3d3'%20fill-rule='evenodd'/%3e%3c/svg%3e",
    width: 200,
    height: 150,
  },
};

// TESTS

describe(`convertToBgImage()`, () => {
  it('should return empty object when failing', () => {
    // @ts-ignore
    const converted = convertToBgImage({});
    expect(converted).toEqual({});
  });

  it('should convert constrained image', () => {
    const converted = convertToBgImage(newFormatConstrainedMock);
    expect(converted).toEqual(convertedFluidMock);
  });

  it('should convert fixed image', () => {
    const converted = convertToBgImage(newFormatFixedMock);
    expect(converted).toEqual(convertedFixedMock);
  });
});

describe(`getPlaceholder()`, () => {
  it(`should return empty object when failing`, () => {
    // @ts-ignore
    const converted = getPlaceholder({});
    expect(converted).toEqual({});
  });
});

describe(`getSrc()`, () => {
  it(`should return empty string when failing`, () => {
    // @ts-ignore
    const converted = getSrc({});
    expect(converted).toEqual('');
  });

  it(`should return empty string when getting empty srcSet`, () => {
    // @ts-ignore
    const converted = getSrc({ srcSet: 'test', sizes: '' });
    expect(converted).toEqual('');
  });
});

describe(`getAllExtraSrcSets()`, () => {
  it(`should return empty object when failing`, () => {
    // @ts-ignore
    const converted = getAllExtraSrcSets({});
    expect(converted).toEqual({});
  });

  it(`should return empty object when getting fake sources`, () => {
    // @ts-ignore
    const converted = getAllExtraSrcSets({ images: { sources: ['test'] } });
    expect(converted).toEqual({});
  });

  it(`shouldn't add duplicate entries`, () => {
    const converted = getAllExtraSrcSets({
      // @ts-ignore
      images: { sources: [{ type: 'image/avif' }, { type: 'image/avif' }] },
    });
    expect(converted).toEqual({});
  });
});

describe(`<BgImage />`, () => {
  it(`should render with image`, () => {
    const { container } = render(
      <BgImage image={newFormatConstrainedMock}>
        <div>test</div>
      </BgImage>
    );
    expect(container).toMatchSnapshot();
  });

  it(`should render without image`, () => {
    const { container } = render(
      <BgImage>
        <div>test</div>
      </BgImage>
    );
    expect(container).toMatchSnapshot();
  });
});
