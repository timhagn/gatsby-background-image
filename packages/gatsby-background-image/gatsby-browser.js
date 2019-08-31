'use strict';

exports.onClientEntry = function (a, pluginOptions) {
  // Set chars to escape in classNames.
  if (pluginOptions.specialChars) {
    window._gbiSpecialChars = pluginOptions.specialChars
  }
}
