"use strict";

var _SimpleUtils = require("./lib/SimpleUtils");

exports.onCreateWebpackConfig = function (_ref, _ref2) {
  var plugins = _ref.plugins,
      actions = _ref.actions;
  var specialChars = _ref2.specialChars;

  if ((0, _SimpleUtils.isString)(specialChars)) {
    actions.setWebpackConfig({
      plugins: [plugins.define({
        __GBI_SPECIAL_CHARS__: JSON.stringify(specialChars)
      })]
    });
  }
};