# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

<a name="0.2.9"></a>

## [0.1.0](https://github.com/timhagn/gatsby-background-image) (2018-12-13)

**Initial commit:** Tests running and module working.

## [0.2.0](https://github.com/timhagn/gatsby-background-image) (2018-12-13)

**feat:** Remove superfluous placeholder images, tracedSVG working.

## [0.2.5](https://github.com/timhagn/gatsby-background-image) (2019-03-13)

**fix:** Add picture wrapper in image creation.

## [0.2.8-beta](https://github.com/timhagn/gatsby-background-image) (2019-03-13)

**fix:** Add some props, parse more backgroundStyles.

## [0.2.8](https://github.com/timhagn/gatsby-background-image) (2019-04-05)

**fix:** Add id as prop, fix some issues with transitions.

## [0.2.9](https://github.com/timhagn/gatsby-background-image) (2019-04-05)

**fix:** Change build to ES5.

## [0.3.0](https://github.com/timhagn/gatsby-background-image) (2019-04-12)

**fix / feat:** Add most changes from issue #20 (styling), fixes issue #22.

## [0.3.1](https://github.com/timhagn/gatsby-background-image) (2019-04-14)

**feat:** Add stripRemainingProps() to safely add ARIA or other attributes.

## [0.3.2](https://github.com/timhagn/gatsby-background-image) (2019-04-14)

**fix:** Add title attribute.

## [0.3.3](https://github.com/timhagn/gatsby-background-image) (2019-04-15)

**doc / feat:** Remove TODO for object-fit / -position (superfluous); specify 
how to use `intersection-observer` polyfill. Sync IO with `gatsby-image`. 

## [0.3.4](https://github.com/timhagn/gatsby-background-image) (2019-04-16)

**fix / feat:** Fix behavior when changing fluid / fixed image props (didn't 
recreate imageRef before). Add possibility for passing `soft` to `fadeIn` to
"force" fading in and image even if it is in cache. 

## [0.3.5](https://github.com/timhagn/gatsby-background-image) (2019-04-14)

**fix:** Duplicate propTypes names to gbiPropTypes array.

## [0.3.6](https://github.com/timhagn/gatsby-background-image) (2019-04-20)

**feat / fix:** Merge #25, fix test errors.

## [0.4.0](https://github.com/timhagn/gatsby-background-image) (2019-04-25)

**feat:** Get feature par with gatsby-image again (add `durationFadeIn` & 
`crossOrigin` props), update tests accordingly. Refactor anonymous IO callback 
to intersectionlistener(), more tests.

## [0.4.1](https://github.com/timhagn/gatsby-background-image) (2019-04-25)

**fix:** Called extracted intersectionListener function instead of passing it. 