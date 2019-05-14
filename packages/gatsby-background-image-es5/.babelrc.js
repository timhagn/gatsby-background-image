let ignore = [`**/dist`]

// Jest needs to compile this code, but generally we don't want this copied
// to output folders
if (process.env.NODE_ENV !== `test`) {
  ignore.push(`**/__tests__`)
}

const gatsbyPresets = require('babel-preset-gatsby-package')(null, { browser: true })
gatsbyPresets.presets[0][1].corejs = 3
gatsbyPresets.presets[0][1].useBuiltIns = `entry`
gatsbyPresets.plugins = gatsbyPresets.plugins.map(item => {
  if (item.indexOf('transform-runtime') !== -1) {
    return ['@babel/plugin-transform-runtime', {
      corejs: 3,
    }]
  }
  return item
})

module.exports = Object.assign(gatsbyPresets, {
  sourceMaps: true,
  ignore,
})
