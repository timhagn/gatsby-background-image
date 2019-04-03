# Contributing to `gatsby-background-image`

_**First of all, thanks for your time reading this and contributing : )!**_   
Contributors are always welcome here and can't be thanked enough for their work!

The following shall be some rough guidelines to get you going on your quest to 
contribute to `gatsby-background-image`.

## Code of Conduct

As this is a rather new package, no real transgressions of human decency
have occurred.  
I'd rather like it to stay that way, so without further ado:   
just try to be and write as your very best self - nobody's here to bite or be 
bitten, right ; )?  

This said or should you need more specic guidelines, 
this package-project wants to follow the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md).

## How to start to contribute

Here are some of the ways you may contribute:

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

Fork [gatsby-background-image](https://github.com/timhagn/gatsby-background-image), 
clone your fork of it and execute either `yarn` or `npm install` in it's folder 
to get yourself up and running for development.

To ease debugging, I'd recommend cloning [gbitest](https://github.com/timhagn/gbitest),
or use your own project. But be sure to run `yarn link` or `npm link` in
`gatsby-background-image`'s folder so you are then able to change back to your 
project's or `gbitest`'s folder and execute `yarn link gatsby-background-image` 
or `npm link gatsby-background-image` accordingly.

As Gatsby compiles your project with each change thanks to hot reloading,
you rather might want to change the line `import BackgroundImage from 'gatsby-background-image'`
to `import BackgroundImage from 'gatsby-background-image/src'` in your component,
to prevent a "double-babelification" and this way some warnings when using
`gatsby-background-image`'s `yarn watch` or `npm run watch` scripts in the background.

But now you are good to go and make some changes!

To finalize your changes, first run `yarn format` or `npm run format`, to use 
prettier to bring your code in line with our "coding standards", head over to 
GitHub and create a Pull Request : )! 

### Testing

Of course this package will never be able to have enough coverage ; )!  
Especially functional tests are missing at the moment.

All tests are run with `jest` / `jest-dom` and `react-testing-library`
at the moment, transformed through `babel-jest`.
  
To get an overview of the tests already existing, run either `yarn test` or 
`npm run test` and head over to the [test folder](src/__tests__) to see where
you may help out with some changes : )!

### Final thoughts

Thanks again for reading this and happy contributing!

Best,

Tim.

