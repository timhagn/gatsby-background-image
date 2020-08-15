let ignore = [`**/dist`];

// Jest needs to compile this code, but generally we don't want this copied
// to output folders
if (process.env.NODE_ENV !== `test`) {
  ignore.push(`**/__tests__`);
}

// Change babel-preset-gatsby-package's options to prevent warnings.
const gatsbyPresets = require('babel-preset-gatsby-package')(null, {
  browser: true,
});
if (gatsbyPresets.presets[0][1].useBuiltIns) {
  gatsbyPresets.presets[0][1].corejs = 3;
}

module.exports = Object.assign(gatsbyPresets, {
  sourceMaps: true,
  comments: false,
  ignore,
});
