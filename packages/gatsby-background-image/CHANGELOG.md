# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

<a name="1.6.0"></a>

## [1.6.0](https://github.com/timhagn/gatsby-background-image) (2021-12-22)

**patch** Merge in #169 to fix #168.

## [1.5.3](https://github.com/timhagn/gatsby-background-image) (2021-04-28)

**typo:** Fix code example in https://www.gatsbyjs.com/plugins/gatsby-background-image/#gatsby-3--gatsby-plugin-image

## [1.5.2](https://github.com/timhagn/gatsby-background-image) (2021-04-22)

**patch:** bump deps

## [1.5.1](https://github.com/timhagn/gatsby-background-image) (2021-04-15)

**fix:** add correct `peerDependencies` of Gatsby

## [1.5.0](https://github.com/timhagn/gatsby-background-image) (2021-03-15)

**feat:** Add possibility of using AVIF in combination with `gbimage-bridge`.

## [1.4.1](https://github.com/timhagn/gatsby-background-image) (2021-02-05)

**bump:** Bump dependencies cause of warnings & add `jest-circus`.

## [1.4.0](https://github.com/timhagn/gatsby-background-image) (2021-01-14)

**feat:** Add `keepStatic` to prevent the container from collapsing when fluid
or fixed imageData should be empty.

## [1.3.1](https://github.com/timhagn/gatsby-background-image) (2020-11-19)

**fix:** Fixed image url() quotation bug for images with parentheses (#138).

## [1.3.0](https://github.com/timhagn/gatsby-background-image) (2020-11-19)

**fix:** Added isBrowser() to check for hasNoScript preventing #131.

## [1.2.0](https://github.com/timhagn/gatsby-background-image) (2020-11-12)

**fix:** Fixed isBrowser() for edge cases in SSR (#136).

## [1.1.2](https://github.com/timhagn/gatsby-background-image) (2020-08-15)

**fix:** Fixed getBackgroundStylesForSingleClass() as sometimes the keys were
camelCase & sometimes kebap-case.

## [1.1.1](https://github.com/timhagn/gatsby-background-image) (2020-04-12)

**fix**: Switched from `document.body.cloneNode(true)` to
`document.createElement('body')` in `activatePictureRef()` as `cloneNode(true)`
copied Listeners as well.

## [1.1.0](https://github.com/timhagn/gatsby-background-image) (2020-04-12)

**fix**: Removed the superfluous `gatsby-background-iamge-wrapper` breaking
images with no `className` set.

## [1.0.1](https://github.com/timhagn/gatsby-background-image) (2020-03-29)

**fix**: Removed the superfluous `jest-environment-jsdom-sixteen` breaking the build.
**feat**: Updated README.

## [1.0.0](https://github.com/timhagn/gatsby-background-image) (2020-03-29)

**feat** Added "Testing `gbi` paragraph to explain testing possibilities without
the now removed `classId`.

**BREAKING CHANGE:** Removed the deprecated `classId`, `resolutions` & `sizes` props.

## [0.10.2](https://github.com/timhagn/gatsby-background-image) (2020-02-21)

**fix** Fixed string return problem for #101 in `getCurrentFromData()`.

## [0.10.1](https://github.com/timhagn/gatsby-background-image) (2020-02-18)

**fix** Added a check to `getCurrentFromData` to prevent `TypeError`s for #101.
Removed all remnant `console.log()` calls for #102.

## [0.10.0](https://github.com/timhagn/gatsby-background-image) (2020-02-16)

**fix** Fixed usage of `imageReferenceCompleted()` in `index.js` to prevent
flashes in Firefox as well (Chromium was already working % ). Fixed `noscript`
styles for art-directed images.

## [0.9.19](https://github.com/timhagn/gatsby-background-image) (2020-02-16)

**patch** Added check functions for `base64` & image strings to prevent #100.

## [0.9.18](https://github.com/timhagn/gatsby-background-image) (2020-02-15)

**fix** Fixed initial Image of Art-Directed Images for #99 ("blur up").

## [0.9.17](https://github.com/timhagn/gatsby-background-image) (2020-02-14)

**fix** Fixed Art-Directed Images for #99 ("blur up") & WebP now working.

## [0.9.16](https://github.com/timhagn/gatsby-background-image) (2020-02-14)

**fix** Added error handling for new cases on build.

## [0.9.15](https://github.com/timhagn/gatsby-background-image) (2020-02-14)

**fix** Tackling #92 & #93. Fixed Flashing for default and art-directed images.
Add fallback for `imageData` for #94.

## [0.9.14](https://github.com/timhagn/gatsby-background-image) (2020-02-02)

**fix** Added fallbacks to prevent 'undefined is not an object' errors for #94.

## [0.9.13](https://github.com/timhagn/gatsby-background-image) (2020-01-24)

**fix** Adapted IFluidObject interface for #97 (`sizes` optional).

## [0.9.12](https://github.com/timhagn/gatsby-background-image) (2019-12-12)

**merge** Merged in #91 to prevent duplicate dots in class names.

## [0.9.11](https://github.com/timhagn/gatsby-background-image) (2019-12-02)

**tweak** Tweak IO detection and now force boolean on `matchesMedia`. Removed
`prop-types` as a normal dependency and added it to `devDependencies`.

## [0.9.10](https://github.com/timhagn/gatsby-background-image) (2019-11-30)

**refactor** Simplified `hasArtDirectionSupport()` in prep of a PR to `gatsby-image`.

## [0.9.9](https://github.com/timhagn/gatsby-background-image) (2019-11-29)

**merge** Merged in #90.

## [0.9.8](https://github.com/timhagn/gatsby-background-image) (2019-11-29)

**fix** Added `sizes` prop to `imageRef` so that the correct image sizes (as it
says ; ) are going to be loaded. Fixes #88.

## [0.9.7](https://github.com/timhagn/gatsby-background-image) (2019-11-23)

**feat / fix** Added art-direction support for `noscript`. Fixed a bug with
`ImageCache` & multiple stacked or art-directed images.

## [0.9.0 - 0.9.6](https://github.com/timhagn/gatsby-background-image) (2019-11-17)

**merge** Finally added art-direction support (single images) for #56.
Removed superfluous `additionalClass` from `index.js`. Refactored function to
logical entities in `lib` folder.
Had some problems publishing `gatsby-node.js` & `gatsby-browser.js` with it so
we're one minor and four patch version further % ).

## [0.8.19](https://github.com/timhagn/gatsby-background-image) (2019-11-15)

**merge** Added a `rootMargin` for #86.

## [0.8.18](https://github.com/timhagn/gatsby-background-image) (2019-11-05)

**merge** Merged #85.

## [0.8.17](https://github.com/timhagn/gatsby-background-image) (2019-11-03)

**doc** Added a workaround explanation for #74 to the READMEs.

## [0.8.16](https://github.com/timhagn/gatsby-background-image) (2019-11-03)

**fix** Added a fallback to combineArray() for #84.

## [0.8.15](https://github.com/timhagn/gatsby-background-image) (2019-10-01)

**merge** Merged #82, bumped deps.

## [0.8.14](https://github.com/timhagn/gatsby-background-image) (2019-09-27)

**fix** Added `filter-invalid-dom-props` dependency to prevent #74's React Warning.

## [0.8.13](https://github.com/timhagn/gatsby-background-image) (2019-09-27)

**merge / change** Merged #77, moved eslintrc to top level.

## [0.8.12](https://github.com/timhagn/gatsby-background-image) (2019-09-20)

**merge** Merged #79, removed pun ^^.

## [0.8.11](https://github.com/timhagn/gatsby-background-image) (2019-09-13)

**fix** Had to republish, somehow the changes weren't babelified oO...

## [0.8.10](https://github.com/timhagn/gatsby-background-image) (2019-09-13)

**fix** Fixed #76 by adding a `finalImage` boolean adding a `opacity: 0;` on the
`after` pseudo-element, when the last image as loaded to prevent visibility of
background `base64` images for transparent bgImages.

## [0.8.9](https://github.com/timhagn/gatsby-background-image) (2019-09-01)

**fix** Trying to fix #60 by adding a selfRef to the component and referencing
it in `activate(Mutliple)ImageRef(s)()` to get the components `offsetWith & -Height).

## [0.8.8](https://github.com/timhagn/gatsby-background-image) (2019-08-31)

**fix** Added `escapeClassNames()` & `specialChars` plugin option to finally
solve #49 and making it possible to style `BackgroundImage` with [Overflow setting](https://github.com/timhagn/gatsby-background-image/tree/main/packages/gatsby-background-image#tailwind-css-and-suchlike-frameworks).

## [0.8.7](https://github.com/timhagn/gatsby-background-image) (2019-08-31)

**fix** Fixed `noscript` behavior by adding `checkLoaded`
prop to `getCurrentFromData()`. Fix `index.d.ts` in `gbi-es5`.

## [0.8.6](https://github.com/timhagn/gatsby-background-image) (2019-08-30)

**fix / doc:** Fixed `index.type.d`, reduced `maxWidth` in example.

## [0.8.5](https://github.com/timhagn/gatsby-background-image) (2019-08-18)

**fix / doc:** Forgot to check on completion for `src` images in
`getCurrentFromData()`, rectified it and solved issue #50.

## [0.8.4](https://github.com/timhagn/gatsby-background-image) (2019-08-16)

**fix / doc:** Added 'addedClassName' to `gbi`'s `state` to prevent regeneration of
classNames on every render. Should fix #56.
Added information on [Overflow setting](https://github.com/timhagn/gatsby-background-image/tree/main/packages/gatsby-background-image#overflow-setting)
to prevent issues like #59.

## [0.8.3](https://github.com/timhagn/gatsby-background-image) (2019-08-01)

**fix:** Removed `overflow: 'hidden'` from default styling, as it was a remnant
of `gbi`'s origins in `gatsby-image` and is now superfluous.

## [0.8.2](https://github.com/timhagn/gatsby-background-image) (2019-07-26)

**fix:** Add `randomAnswerToLifeTheUniverseAndEverything` to "uniquely hashed"
classname fixing issue #55.

## [0.8.1](https://github.com/timhagn/gatsby-background-image) (2019-07-26)

**fix:** Removed superfluous props, so id, title, etc. get properly handled.

## [0.8.0](https://github.com/timhagn/gatsby-background-image) (2019-07-03)

**fix / feat:** Fix handling of CSS styles in multiple images for `noscript`,
IE 11 now seems to work : ).

## [0.7.6](https://github.com/timhagn/gatsby-background-image) (2019-07-01)

**fix:** Fix handling of CSS styles in multiple images, checking for `http`
after PR #46 broke it.

## [0.7.5](https://github.com/timhagn/gatsby-background-image) (2019-07-01)

**fix / feat:** Reverted the changes of 0.7.4 and added `preserveStackingContext`
option to props to allow for children with stacking context changing elements.
Prevent issues like #41.

## [0.7.4](https://github.com/timhagn/gatsby-background-image) (2019-06-22)

**fix:** Added `stacking-context-reset` wrapper div around `children` to, as it
says, reset the stacking context to prevent issues like #41.

## [0.7.3](https://github.com/timhagn/gatsby-background-image) (2019-06-22)

**fix:** Merged PR #43 of @joshdcuneo fixing TS definitions.
Also **never fixed**: R.I.P. Oma (granny / abuela / nonna)...

## [0.7.2](https://github.com/timhagn/gatsby-background-image) (2019-06-18)

**feat:** Added possibility to work with CSS Strings like `rgba()` or
`linear-gradient` for multiple stacked background-images.

## [0.7.1](https://github.com/timhagn/gatsby-background-image) (2019-06-12)

**fix:** Fixed jumping of multiple images (added dummy image array) as well as
only showing images if really fully loaded.

## [0.7.0](https://github.com/timhagn/gatsby-background-image) (2019-05-28)

**feat:** Added possibility to work with multiple stacked background-images.

## [0.6.2](https://github.com/timhagn/gatsby-background-image) (2019-05-19)

**merge:** Merged PR from @seangabe fixing TypeDefs.

## [0.6.1](https://github.com/timhagn/gatsby-background-image) (2019-05-15)

**fix / feat:** Fixed some quirks with transitions, add integration tests.

## [0.6.0](https://github.com/timhagn/gatsby-background-image) (2019-05-14)

**feat:** Split packages in `gatsby-background-image` & `gatsby-background-image-es5`.

## [0.5.9](https://github.com/timhagn/gatsby-background-image) (2019-05-13)

**quickfix:** Changed `@babel/runtime-corejs3` back to `@babel/runtime`.

## [0.5.8](https://github.com/timhagn/gatsby-background-image) (2019-05-13)

**fix:** With `@babel/runtime-corejs3` package size exploded, so just targeted
specific function missing in IE 11 and exchanged `Array.from` with
`Array.prototype.slice.call` and `Array.find` with its `Array.reduce` equivalent.

## [0.5.7](https://github.com/timhagn/gatsby-background-image) (2019-05-12)

**fix:** Removed `@babel-polyfill` and went with `@babel/runtime-corejs3`.

## [0.5.6](https://github.com/timhagn/gatsby-background-image) (2019-05-07)

**fix:** Added some workarounds and `@babel-polyfill` for IE11 compatibility,
reintroduced `imageRef.src` as fallback for browsers without `currentSrc`.

## [0.5.5](https://github.com/timhagn/gatsby-background-image) (2019-05-07)

**fix:** Replaced Math.random() "hash" generation with an implementation of
Java's hashCode() function on either current `srcSet` or given `className`.

## [0.5.4](https://github.com/timhagn/gatsby-background-image) (2019-05-07)

**feat / fix:** Added a componentClassCache to prevent duplicate render with
different images.

## [0.5.3](https://github.com/timhagn/gatsby-background-image) (2019-05-04)

**feat:** Contribution of TypeScript definitions.

## [0.5.2](https://github.com/timhagn/gatsby-background-image) (2019-05-02)

**fix:** Added isVisible to activatePictureRef() props (page change / cached).

## [0.5.1](https://github.com/timhagn/gatsby-background-image) (2019-05-02)

**fix:** Added activatePictureRef() to really only load critical or visible images.

## [0.5.0](https://github.com/timhagn/gatsby-background-image) (2019-05-01)

**deprecation / refactor / fix / feat / doc:**

- `_depr` was added to classes generated by adding classId.
- `<BackgroundImage />` fixed & fluid branches were simplified to one return value.
- As the transitions still didn't work, a "micro fixed state machine (mFSM)" was
  integrated. Tests were refactored, mocks and setup moved to their own file.
- `isMounted` was removed in favor of setting `imageRef.onload` to `null` on
  `componentWillUnmount`.
- SSR tests were added.
- Code Coverage was pushed to 100%.
- codecov was added to CircleCI build and badge added to README.

## [0.4.3](https://github.com/timhagn/gatsby-background-image) (2019-04-29)

**fix:** Fixed transitions for the moment for issue #26.

## [0.4.2](https://github.com/timhagn/gatsby-background-image) (2019-04-28)

**doc / feat:** Changed babel behavior from @babel/polyfill to new
core-js/stable & updated README.md.

## [0.4.1](https://github.com/timhagn/gatsby-background-image) (2019-04-25)

**fix:** Called extracted intersectionListener function instead of passing it.

## [0.4.0](https://github.com/timhagn/gatsby-background-image) (2019-04-25)

**feat:** Get feature par with gatsby-image again (add `durationFadeIn` &
`crossOrigin` props), update tests accordingly. Refactor anonymous IO callback
to intersectionlistener(), more tests.

## [0.3.6](https://github.com/timhagn/gatsby-background-image) (2019-04-20)

**feat / fix:** Merge #25, fix test errors.

## [0.3.5](https://github.com/timhagn/gatsby-background-image) (2019-04-14)

**fix:** Duplicate propTypes names to gbiPropTypes array.

## [0.3.4](https://github.com/timhagn/gatsby-background-image) (2019-04-16)

**fix / feat:** Fix behavior when changing fluid / fixed image props (didn't
recreate imageRef before). Add possibility for passing `soft` to `fadeIn` to
"force" fading in and image even if it is in cache.

## [0.3.3](https://github.com/timhagn/gatsby-background-image) (2019-04-15)

**doc / feat:** Remove TODO for object-fit / -position (superfluous); specify
how to use `intersection-observer` polyfill. Sync IO with `gatsby-image`.

## [0.3.2](https://github.com/timhagn/gatsby-background-image) (2019-04-14)

**fix:** Add title attribute.

## [0.3.1](https://github.com/timhagn/gatsby-background-image) (2019-04-14)

**feat:** Add stripRemainingProps() to safely add ARIA or other attributes.

## [0.3.0](https://github.com/timhagn/gatsby-background-image) (2019-04-12)

**fix / feat:** Add most changes from issue #20 (styling), fixes issue #22.

## [0.2.9](https://github.com/timhagn/gatsby-background-image) (2019-04-05)

**fix:** Change build to ES5.

## [0.2.8](https://github.com/timhagn/gatsby-background-image) (2019-04-05)

**fix:** Add id as prop, fix some issues with transitions.

## [0.2.8-beta](https://github.com/timhagn/gatsby-background-image) (2019-03-13)

**fix:** Add some props, parse more backgroundStyles.

## [0.2.5](https://github.com/timhagn/gatsby-background-image) (2019-03-13)

**fix:** Add picture wrapper in image creation.

## [0.2.0](https://github.com/timhagn/gatsby-background-image) (2018-12-13)

**feat:** Remove superfluous placeholder images, tracedSVG working.

## [0.1.0](https://github.com/timhagn/gatsby-background-image) (2018-12-13)

**Initial commit:** Tests running and module working.
