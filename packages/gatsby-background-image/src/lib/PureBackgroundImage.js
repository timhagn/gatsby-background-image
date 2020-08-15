import React from 'react'
import PropTypes from 'prop-types'

class PureBackgroundImage extends React.PureComponent {
  render() {
    const {
      Tag,
      currentClassNames,
      currentStyles,
      handleRef,
      componentKey,
      remainingProps,
      pseudoStyles,
      hasNoScript,
      noScriptPseudoStyles,
      children,
    } = this.props
    return (
      <Tag
        className={currentClassNames}
        style={currentStyles}
        ref={handleRef}
        key={componentKey}
        {...remainingProps}
      >
        {/* Create style element to transition between pseudo-elements. */}
        {/* TODO: try to memoize this */}
        <style
          dangerouslySetInnerHTML={{
            __html: pseudoStyles,
          }}
        />
        {/* Set the original image(s) during SSR & if JS is disabled */}
        {hasNoScript && (
          <noscript>
            <style
              dangerouslySetInnerHTML={{
                __html: noScriptPseudoStyles,
              }}
            />
          </noscript>
        )}
        {children}
      </Tag>
    )
  }
}

PureBackgroundImage.propTypes = {
  Tag: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
  currentClassNames: PropTypes.string.isRequired,
  currentStyles: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
    .isRequired,
  pseudoStyles: PropTypes.string.isRequired,
  handleRef: PropTypes.func.isRequired,
  componentKey: PropTypes.string.isRequired,
  hasNoScript: PropTypes.bool.isRequired,
  noScriptPseudoStyles: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  remainingProps: PropTypes.any,
}

export default PureBackgroundImage
