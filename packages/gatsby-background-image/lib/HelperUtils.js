"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.logDeprecationNotice = exports.convertProps = exports.stripRemainingProps = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _filterInvalidDomProps = _interopRequireDefault(require("filter-invalid-dom-props"));

var _MediaUtils = require("./MediaUtils");

var stripRemainingProps = function stripRemainingProps(props) {
  return (0, _filterInvalidDomProps.default)(props);
};
/**
 * Handle legacy names for image queries
 *
 * @param props
 * @return {Object}
 */


exports.stripRemainingProps = stripRemainingProps;

var convertProps = function convertProps(props) {
  var convertedProps = (0, _extends2.default)({}, props);
  var resolutions = convertedProps.resolutions,
      sizes = convertedProps.sizes,
      classId = convertedProps.classId,
      fixed = convertedProps.fixed,
      fluid = convertedProps.fluid;

  if (resolutions) {
    convertedProps.fixed = resolutions;
    delete convertedProps.resolutions;
  }

  if (sizes) {
    convertedProps.fluid = sizes;
    delete convertedProps.sizes;
  }

  if (classId) {
    logDeprecationNotice("classId", "gatsby-background-image should provide unique classes automatically. Open an Issue should you still need this property.");
  } // if (fluid && !hasImageArray(props)) {
  //   convertedProps.fluid = [].concat(fluid)
  // }
  //
  // if (fixed && !hasImageArray(props)) {
  //   convertedProps.fixed = [].concat(fixed)
  // }
  // convert fluid & fixed to arrays so we only have to work with arrays


  if (fluid && (0, _MediaUtils.hasArtDirectionFluidArray)(props)) {
    convertedProps.fluid = (0, _MediaUtils.groupByMedia)(convertedProps.fluid);
  }

  if (fixed && (0, _MediaUtils.hasArtDirectionFixedArray)(props)) {
    convertedProps.fixed = (0, _MediaUtils.groupByMedia)(convertedProps.fixed);
  }

  return convertedProps;
};
/**
 * Logs a warning if deprecated props where used.
 *
 * @param prop
 * @param notice
 */


exports.convertProps = convertProps;

var logDeprecationNotice = function logDeprecationNotice(prop, notice) {
  if (process.env.NODE_ENV === "production") {
    return;
  }

  console.log("\n    The \"" + prop + "\" prop is now deprecated and will be removed in the next major version\n    of \"gatsby-background-image\".\n    ");

  if (notice) {
    console.log(notice);
  }
};

exports.logDeprecationNotice = logDeprecationNotice;