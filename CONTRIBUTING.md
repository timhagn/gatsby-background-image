# Contributing to `gatsby-background-image`

_**First of all, thanks for your time reading this and contributing : )!**_   
Contributors are always welcome here and can't be thanked enough for their work!

The following shall be some rough guidelines to get you going on your quest to 
contribute to `gatsby-background-image`.

## Your Gain from Contributing

Right now you're gonna get my eternal thankfulness and reputation in helping
out in a small but (rapidly oO) growing OSS package : ).

But, no fear, I'm thinking of ways to give you more reward than that, and am
definitely open for any ideas (methinks [all-contributors](https://allcontributors.org/)
would be a little over the top at the moment, but just raise your opinion : )!

## Code of Conduct

As this is a rather new package, no real transgressions of human decency
have occurred.  
I'd rather like it to stay that way, so without further ado:   
*just try to be and write as your very best self - nobody's here to bite or be 
bitten, right ; )?*

That being said sums it up quite nicely - thou should you need more specific guidelines,  
this package-project wants to follow the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md).

## How to start to contribute

Be it fixing typos (which I think there may be many of ; ), enhancements to 
documentation (including this file), code changes or whatever you might have up 
your sleeve: Here are some of the ways you may contribute. 

### Questions / Issues / Bugs / Enhancements

Have an issue or bug you want addressed? Have a feature request or another 
enhancement you'd really want to see in the next version of this package?
Or just have a question pertaining some functionality?

At the moment every one of these cases is tracked as a [GitHub issue](https://guides.github.com/features/issues/).
Already know how to handle them? Head over to the [issue section](https://github.com/timhagn/gatsby-background-image/issues),
and please try first to search for any open or closed issues which might already 
have addressed your's. 
  
Haven't found one? Open a new issue and follow the template guidelines there!

### Pull Requests

First of all fork [gatsby-background-image](https://github.com/timhagn/gatsby-background-image)
and `git clone --depth=1` your fork of it. For textual changes (typos, 
documentation, addition) just write them and read below about creating a PR.

From `v0.6.0` on `gatsby-background-image` is a monorepo managed with [`lerna`](https://lerna.js.org/),
so this manual will slowly be updated accordingly!
 
To change or add some code execute `yarn bootstrap` in your cloned 
forks folder first, to get yourself up and running for development.  
A quick `yarn test` tells you if everything is working.

To execute a local CircleCI run of configured [jobs](.circleci/config.yml), 
install [docker](https://docs.docker.com/install/)
as well as [circleci-cli](https://circleci.com/docs/2.0/local-cli/).
Afterwards run the following:

```
yarn cci
```

To ease debugging, I'd recommend cloning [gbitest](https://github.com/timhagn/gbitest),
or use your own project.   
Though `yarn link` doesn't work with `lerna`, we can (ab)use Gatsby's own
[`gatsby-dev-cli`](https://www.gatsbyjs.org/packages/gatsby-dev-cli/) to debug
`gatsby-background-image` or `gatsby-background-image-es5`:

First install `gatsby-dev-cli` globally like this:

```
npm install -g gatsby-dev-cli
```

Now go to to your projects or `gbitest`'s folder and instead of setting the path
to a clone of the `gatsby` repo, set the link path to your own cloned fork:

```
gatsby-dev --set-path-to-repo /your/path/to/your/fork/of/gatsby-background-image
```

Afterwards, to copy both packages over into your `node_modules` folder, run:

```
gatsby-dev (--copy-all)
```

**But be sure to have added one or both of them to your `package.json`, else 
Gatsby won't find them!**  
The `--copy-all` option tells `gatsby-dev` to include the `src`, which is
important fot the next step.

As Gatsby compiles your project with each change thanks to hot reloading,
you rather might want to change the line `import BackgroundImage from 'gatsby-background-image'`
to `import BackgroundImage from 'gatsby-background-image/src'` in your component,
to prevent a "double-babelification" and this way some warnings when using
`gatsby-background-image`'s `yarn watch` scripts in the background.

*But now you are good to go and make some changes!*
(Afterwards, to finalize them before you push em, you may want to run 
`yarn format` or `npm run format`, to use `prettier` to bring your code in line 
with our "coding standards" ; ).


Last but not least, head over to GitHub and create a [Pull Request](https://help.github.com/en/articles/about-pull-requests) 
with your changes : )! 

### Testing

First of all, you're definitely welcome to do manual functional or performance 
tests and report back on it in an issue or suchlike : )!

Though of course this package will never be able to have enough coverage ; )!  
Especially functional tests are missing at the moment.

All tests are run with `jest` / `jest-dom` and `react-testing-library`
at the moment, transformed through `babel-jest`.
  
To get an overview of the tests already existing, run either `yarn test` or 
`npm run test` and head over to the [test folder](packages/gatsby-background-image/src/__tests__) 
to see where you may help out with some changes : )!

### Final thoughts

Thanks again for reading this and happy contributing!

Best,

Tim.
