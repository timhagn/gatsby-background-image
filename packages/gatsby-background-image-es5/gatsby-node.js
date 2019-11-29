"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _stringify = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/json/stringify"));

var _SimpleUtils = require("./lib/SimpleUtils");

exports.onCreateWebpackConfig = function (_ref, _ref2) {
  var plugins = _ref.plugins,
      actions = _ref.actions;
  var specialChars = _ref2.specialChars;

  if ((0, _SimpleUtils.isString)(specialChars)) {
    actions.setWebpackConfig({
      plugins: [plugins.define({
        __GBI_SPECIAL_CHARS__: (0, _stringify.default)(specialChars)
      })]
    });
  }
};