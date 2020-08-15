module.exports = {
  siteMetadata: {
    title: `gatsby-background-image Test Site`,
    description: `Have a look at the similarities and differences of gatsby-background-image to gatsby-image side by side`,
    author: `@timhagn`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    'gatsby-plugin-styled-components',
    // Adds in Gatsby image handling
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-background-image Test Site`,
        short_name: `gbitest`,
        start_url: `/`,
        background_color: `#00446f`,
        theme_color: `#00446f`,
        display: `minimal-ui`,
        icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
