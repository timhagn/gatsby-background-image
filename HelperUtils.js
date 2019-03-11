"use strict";

exports.__esModule = true;
exports.convertProps = void 0;

/**
 * Handle legacy names for image queries.
 * @param props
 * @return {Object}
 */
const convertProps = props => {
  let convertedProps = { ...props
  };

  if (convertedProps.resolutions) {
    convertedProps.fixed = convertedProps.resolutions;
    delete convertedProps.resolutions;
  }

  if (convertedProps.sizes) {
    convertedProps.fluid = convertedProps.sizes;
    delete convertedProps.sizes;
  }

  return convertedProps;
};

exports.convertProps = convertProps;