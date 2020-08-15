import {
  activateCacheForImage,
  inImageCache,
  resetImageCache,
} from '../lib/ImageCache';
import { fixedMock, fluidMock } from './mocks/Various.mock';

describe(`inImageCache() / activateCacheForImage()`, () => {
  it(`should return false for initial load (fixed)`, () => {
    fixedMock.src = `test.jpg`;
    const inCache = inImageCache(fixedMock);
    expect(inCache).toBeFalsy();
  });

  it(`shouldn't activate cache without fixed / fluid`, () => {
    activateCacheForImage();
    const inCache = inImageCache();
    expect(inCache).toBeFalsy();
  });

  it(`should return img from cache after activateCacheForImage() (fixed)`, () => {
    activateCacheForImage(fixedMock);
    const inCache = inImageCache(fixedMock);
    expect(inCache).toBeTruthy();
  });

  it(`inImageCache() should return false for initial load (fluid)`, () => {
    const inCache = inImageCache(fluidMock);
    expect(inCache).toBeFalsy();
  });

  it(`should return img from cache after activateCacheForImage() (fluid)`, () => {
    activateCacheForImage(fluidMock);
    const inCache = inImageCache(fluidMock);
    expect(inCache).toBeTruthy();
  });

  it(`should return false without mock`, () => {
    const inCache = inImageCache();
    expect(inCache).toBeFalsy();
  });
});

describe(`inImageCache() / activateCacheForImage() / resetImageCache()`, () => {
  it(`should reset imageCache after caching`, () => {
    activateCacheForImage(fluidMock);
    resetImageCache();
    const inCache = inImageCache(fluidMock);
    expect(inCache).toBeFalsy();
  });
});
