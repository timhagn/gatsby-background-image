import { isString } from './HelperUtils'

exports.onCreateWebpackConfig = ({ plugins, actions }, { specialChars }) => {
  if (isString(specialChars)) {
    actions.setWebpackConfig({
      plugins: [
        plugins.define({
          __GBI_SPECIAL_CHARS__: JSON.stringify(specialChars),
        }),
      ],
    })
  }
}
