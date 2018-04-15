'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SwipeRow = function (_Component) {
  _inherits(SwipeRow, _Component);

  function SwipeRow(props) {
    _classCallCheck(this, SwipeRow);

    var _this = _possibleConstructorReturn(this, (SwipeRow.__proto__ || Object.getPrototypeOf(SwipeRow)).call(this, props));

    _this.state = {
      x: 0,
      y: 0,
      startTime: null,
      swiping: 0, // 0 means undefined swiping direction, 1 means horizental swiping and -1 means vertical swiping
      move: 0,
      offset: 0,
      transition: false,
      leftActionBoxWidth: 0,
      leftActionBoxVisibility: false,
      rightActionBoxWidth: 0,
      rightActionBoxVisibility: false
    };
    _this.handleTouchStart = _this.handleTouchStart.bind(_this);
    _this.handleTouchMove = _this.handleTouchMove.bind(_this);
    _this.handleTouchEnd = _this.handleTouchEnd.bind(_this);
    return _this;
  }

  _createClass(SwipeRow, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.setState({
        leftActionBoxWidth: this.leftActionBox.getBoundingClientRect().width,
        rightActionBoxWidth: this.rightActionBox.getBoundingClientRect().width
      });
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.isClose !== this.props.isClose && nextProps.isClose) {
        this.doClose();
      }
    }
  }, {
    key: 'doUpdateContentOffset',
    value: function doUpdateContentOffset() {
      var offset = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

      this.setState({
        swiping: 0,
        move: 0,
        offset: offset,
        transition: true
      });
    }
  }, {
    key: 'doClose',
    value: function doClose() {
      this.doUpdateContentOffset(0);
    }
  }, {
    key: 'getPosition',
    value: function getPosition(e) {
      return {
        x: e.targetTouches[0].clientX,
        y: e.targetTouches[0].clientY
      };
    }
  }, {
    key: 'calculateMovingDistance',
    value: function calculateMovingDistance(e) {
      var _getPosition = this.getPosition(e),
          x = _getPosition.x,
          y = _getPosition.y;

      var deltaX = x - this.state.x;
      var deltaY = y - this.state.y;
      return {
        deltaX: deltaX,
        deltaY: deltaY,
        absX: Math.abs(deltaX),
        absY: Math.abs(deltaY)
      };
    }
  }, {
    key: 'handleTouchStart',
    value: function handleTouchStart(e) {
      var _getPosition2 = this.getPosition(e),
          x = _getPosition2.x,
          y = _getPosition2.y;

      this.setState({
        x: x,
        y: y,
        startTime: Date.now()
      });
      this.props.onTouchStart && this.props.onTouchStart(e, this.state);
    }
  }, {
    key: 'handleTouchMove',
    value: function handleTouchMove(e) {
      var _props = this.props,
          deltaThreshold = _props.deltaThreshold,
          disableSwipeLeft = _props.disableSwipeLeft,
          disableSwipeRight = _props.disableSwipeRight;

      var _calculateMovingDista = this.calculateMovingDistance(e),
          deltaX = _calculateMovingDista.deltaX,
          absX = _calculateMovingDista.absX,
          absY = _calculateMovingDista.absY;

      var swiping = this.state.swiping;
      if (absX < deltaThreshold && absY < deltaThreshold && !swiping) {
        return;
      }

      // defined swiping when acrossed delta threshold
      if (!swiping) {
        swiping = absX > absY ? 1 : -1;
      }

      if (swiping > 0) {
        // if this swiping is defined as a horzental swiping, prevent default behavior
        // and update the state of SwipeRow
        e.preventDefault();

        var move = deltaX;
        var offset = this.state.offset;
        var contentPosition = move + offset;

        // handle the disable swipe
        if (disableSwipeRight && contentPosition >= 0 || disableSwipeLeft && contentPosition <= 0) {
          move = 0;
          offset = 0;
        }

        this.setState({
          swiping: swiping,
          move: move,
          offset: offset,
          transition: false,
          leftActionBoxVisibility: contentPosition > 0,
          rightActionBoxVisibility: contentPosition < 0
        });
      } else {
        // if this swiping is regarded as a vertical swiping, ignore horizental swiping change
        this.setState({
          swiping: swiping
        });
      }
      this.props.onTouchMove && this.props.onTouchMove(e, this.state);
    }
  }, {
    key: 'handleTouchEnd',
    value: function handleTouchEnd(e) {
      var _state = this.state,
          move = _state.move,
          startTime = _state.startTime,
          offset = _state.offset,
          leftActionBoxWidth = _state.leftActionBoxWidth,
          rightActionBoxWidth = _state.rightActionBoxWidth;
      var _props2 = this.props,
          switchThreshold = _props2.switchThreshold,
          flickThreshold = _props2.flickThreshold,
          disableSwipeLeft = _props2.disableSwipeLeft,
          disableSwipeRight = _props2.disableSwipeRight;


      var contentPosition = move + offset;
      var duration = Date.now() - startTime;

      var newOffset = offset;

      if (move > 0) {
        // if swipe right
        if (duration < flickThreshold) {
          // if it is a flick swipe
          newOffset = offset < 0 ? 0 : leftActionBoxWidth;
        } else {
          // check whether the right action box needs to be closed
          if (contentPosition > -rightActionBoxWidth * switchThreshold) {
            // check whether the left action box need to be open
            newOffset = !disableSwipeRight && contentPosition > leftActionBoxWidth * switchThreshold ? leftActionBoxWidth : 0;
          }
        }
      } else if (move < 0) {
        // if swipe left
        if (duration < flickThreshold) {
          // if it is a flick swipe
          newOffset = offset > 0 ? 0 : -rightActionBoxWidth;
        } else {
          // check whether the left action box needs to be closed
          if (contentPosition < leftActionBoxWidth * switchThreshold) {
            // check whether the right action box need to be open
            newOffset = !disableSwipeLeft && contentPosition < -rightActionBoxWidth * switchThreshold ? -rightActionBoxWidth : 0;
          }
        }
      }

      this.doUpdateContentOffset(newOffset);
      this.props.onTouchEnd && this.props.onTouchEnd(e, this.state);
    }
  }, {
    key: 'wrapParallaxActions',
    value: function wrapParallaxActions(buttons, align, contentPosition, width, transition) {
      return buttons && buttons.map(function (el, idx) {
        return _react2.default.createElement(
          'div',
          {
            key: idx,
            style: {
              position: 'relative',
              flexGrow: 1,
              transition: transition,
              left: align === 'left' ? Math.min(0, -(width / buttons.length) * idx - contentPosition * (1 / buttons.length * idx)) : Math.max(0, width / buttons.length * idx - contentPosition * (1 / buttons.length * idx))
            }
          },
          el
        );
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props3 = this.props,
          leftButtons = _props3.leftButtons,
          rightButtons = _props3.rightButtons,
          transitionFunc = _props3.transitionFunc,
          disableParallax = _props3.disableParallax,
          disableExpand = _props3.disableExpand,
          className = _props3.className,
          children = _props3.children,
          _state2 = this.state,
          move = _state2.move,
          offset = _state2.offset,
          transition = _state2.transition,
          leftActionBoxWidth = _state2.leftActionBoxWidth,
          rightActionBoxWidth = _state2.rightActionBoxWidth,
          leftActionBoxVisibility = _state2.leftActionBoxVisibility,
          rightActionBoxVisibility = _state2.rightActionBoxVisibility;


      var transitionStyle = this.state.swiping && !transition ? '' : transitionFunc;
      var contentPosition = move + offset;

      return _react2.default.createElement(
        'div',
        {
          className: className,
          style: { position: 'relative', overflow: 'hidden' }
        },
        _react2.default.createElement(
          'div',
          {
            className: 'sr-content',
            style: {
              position: 'relative',
              left: contentPosition,
              zIndex: 2,
              transition: transitionStyle
            },
            onTouchStart: this.handleTouchStart,
            onTouchEnd: this.handleTouchEnd,
            onTouchMove: this.handleTouchMove,
            onTransitionEnd: function onTransitionEnd() {
              return _this2.setState({
                transition: false,
                leftActionBoxVisibility: offset > 0,
                rightActionBoxVisibility: offset < 0
              });
            }
          },
          children
        ),
        _react2.default.createElement(
          'div',
          {
            className: 'sr-left-buttons',
            ref: function ref(el) {
              _this2.leftActionBox = el;
            },
            style: {
              visibility: leftActionBoxVisibility ? 'visible' : 'hidden',
              position: 'absolute',
              top: 0,
              left: disableParallax ? 0 : Math.min(0, -leftActionBoxWidth + contentPosition),
              width: disableParallax || disableExpand ? 'auto' : Math.max(leftActionBoxWidth, contentPosition) || 'auto',
              height: '100%',
              display: 'flex',
              flexDirection: 'row-reverse',
              transition: transitionStyle
            }
          },
          disableParallax ? leftButtons : this.wrapParallaxActions(leftButtons, 'right', contentPosition, leftActionBoxWidth, transitionStyle)
        ),
        _react2.default.createElement(
          'div',
          {
            className: 'sr-right-buttons',
            ref: function ref(el) {
              _this2.rightActionBox = el;
            },
            style: {
              visibility: rightActionBoxVisibility ? 'visible' : 'hidden',
              position: 'absolute',
              top: 0,
              right: disableParallax ? 0 : Math.min(0, -rightActionBoxWidth - contentPosition),
              width: disableParallax || disableExpand ? 'auto' : Math.max(rightActionBoxWidth, -contentPosition) || 'auto',
              height: '100%',
              display: 'flex',
              transition: transitionStyle
            }
          },
          disableParallax ? rightButtons : this.wrapParallaxActions(rightButtons, 'left', contentPosition, rightActionBoxWidth, transitionStyle)
        )
      );
    }
  }]);

  return SwipeRow;
}(_react.Component);

exports.default = SwipeRow;


SwipeRow.propTypes = {
  onTouchStart: _propTypes2.default.func,
  onTouchMove: _propTypes2.default.func,
  onTouchEnd: _propTypes2.default.func,
  /**
   * Class name to customize style of wrapper component
   */
  className: _propTypes2.default.string,
  /**
   * React components which will be the content of the SwipeRow
   */
  children: _propTypes2.default.node,
  /**
   * React components at the left side
   */
  leftButtons: _propTypes2.default.array,
  /**
   * React components at the right side
   */
  rightButtons: _propTypes2.default.array,
  /**
   * Forced SwipeRow to close if isClose is true
   */
  isClose: _propTypes2.default.bool,
  /**
   * The propotion of left and right buttons' width  to trigger those buttons to switch
   */
  switchThreshold: _propTypes2.default.number,
  /**
   * The moving distance to determine this swipe is vertical or horizontal
   */
  deltaThreshold: _propTypes2.default.number,
  /**
   * The duration time to determine the swipe is flick or not
   */
  flickThreshold: _propTypes2.default.number,
  /**
   * The transition function of touch end animation
   */
  transitionFunc: _propTypes2.default.string,
  /**
   * Disable content to swipe left
   */
  disableSwipeLeft: _propTypes2.default.bool,
  /**
   * Disable content to swipe right
   */
  disableSwipeRight: _propTypes2.default.bool,
  /**
   * Disable parallax when buttons swiping
   */
  disableParallax: _propTypes2.default.bool,
  /**
   * Disable expend effect when buttons swiping
   */
  disableExpand: _propTypes2.default.bool
};

SwipeRow.defaultProps = {
  leftButtons: [],
  rightButtons: [],
  isClose: undefined,
  switchThreshold: 0.5,
  deltaThreshold: 10,
  flickThreshold: 200,
  transitionFunc: 'all .3s cubic-bezier(0, 0, 0, 1)',
  disableSwipeLeft: false,
  disableSwipeRight: false,
  disableParallax: false,
  disableExpand: false
};