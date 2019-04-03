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

### Testing


TODO!

From `gbitest`:  
Fork [`gatsby-background-image`](https://github.com/timhagn/gatsby-background-image), 
clone your fork of it to it's own folder and execute either `yarn link` or `npm link` 
in there.

Then change back to your `gbitest` folder and execute 
`yarn link gatsby-background-image` or `npm link gatsby-background-image` accordingly.

Now you only have to change the line `import BackgroundImage from 'gatsby-background-image'`
to `import BackgroundImage from 'gatsby-background-image/src'` in 
[src/components/index.js](src/components/index.js) and you are good to go!    

