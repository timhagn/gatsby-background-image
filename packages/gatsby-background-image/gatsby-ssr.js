"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _react = _interopRequireDefault(require("react"));

var _commonTags = require("common-tags");

var generateHtml = function generateHtml(str) {
  return {
    __html: (0, _commonTags.oneLine)(str)
  };
};

var HeadComponents = [_react.default.createElement("style", {
  key: "main-above",
  "data-gbi": "",
  dangerouslySetInnerHTML: generateHtml(".gatsby-image-wrapper { content: 'TEST'; }")
}), _react.default.createElement("script", {
  key: "gbi-script",
  type: "module",
  dangerouslySetInnerHTML: generateHtml("\n      const mainStyleTag = document.body.querySelector('[data-main-bgimage]');\n      const aboveTheFoldStyle = document.body.querySelector('[data-gbi]')\n      aboveTheFoldStyle.textContent = mainStyleTag.textContent;\n    ")
})];

exports.onRenderBody = function (_ref) {
  var setHeadComponents = _ref.setHeadComponents;
};