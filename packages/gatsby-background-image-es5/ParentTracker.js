"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = createParentTracker;

var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/assertThisInitialized"));

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inheritsLoose"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _jsxFileName = "/media/hagn/horsedump/Projects/own_n_oss/gbi/packages/gatsby-background-image-es5/src/ParentTracker.js";

var ParentContext = _react.default.createContext(null); // function to apply to your react component class


function createParentTracker(componentClass) {
  var Holder =
  /*#__PURE__*/
  function (_React$Component) {
    (0, _inheritsLoose2.default)(Holder, _React$Component);

    function Holder() {
      var _context;

      var _this;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _React$Component.call.apply(_React$Component, (0, _concat.default)(_context = [this]).call(_context, args)) || this;
      (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "refToInstance", void 0);
      return _this;
    }

    var _proto = Holder.prototype;

    _proto.render = function render() {
      var _this2 = this;

      return _react.default.createElement(_react.default.Fragment, null, _react.default.createElement(ParentContext.Consumer, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 14
        },
        __self: this
      }, function (parent) {
        console.log('I am:', _this2, ' my parent is:', parent ? parent.name : 'null');
        return _react.default.createElement(ParentContext.Provider, {
          value: _this2,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 23
          },
          __self: this
        }, _react.default.createElement("componentClass", (0, _extends2.default)({
          ref: function ref(inst) {
            return _this2.refToInstance = inst;
          },
          parent: parent
        }, _this2.props, {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 24
          },
          __self: this
        })));
      }));
    };

    return Holder;
  }(_react.default.Component); // return wrapped component to be exported in place of yours


  return Holder;
}