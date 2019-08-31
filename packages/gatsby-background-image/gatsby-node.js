"use strict";

var _HelperUtils = require("./HelperUtils");

exports.onCreateWebpackConfig = function (_ref, _ref2) {
  var plugins = _ref.plugins,
      actions = _ref.actions;
  var specialChars = _ref2.specialChars;

  if ((0, _HelperUtils.isString)(specialChars)) {
    actions.setWebpackConfig({
      plugins: [plugins.define({
        __GBI_SPECIAL_CHARS__: JSON.stringify(specialChars)
      })]
    });
  }
};