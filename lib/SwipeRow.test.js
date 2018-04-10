'use strict'

var _react = require('react')

var _react2 = _interopRequireDefault(_react)

var _SwipeRow = require('./SwipeRow')

var _SwipeRow2 = _interopRequireDefault(_SwipeRow)

var _enzyme = require('enzyme')

var _enzyme2 = _interopRequireDefault(_enzyme)

var _enzymeAdapterReact = require('enzyme-adapter-react-16')

var _enzymeAdapterReact2 = _interopRequireDefault(_enzymeAdapterReact)

function _interopRequireDefault (obj) { return obj && obj.__esModule ? obj : { default: obj } }

_enzyme2.default.configure({ adapter: new _enzymeAdapterReact2.default() })

function createClientXY (x, y) {
  return { clientX: x, clientY: y }
}

function createTouchEventObject (_ref) {
  var _ref$x = _ref.x,
    x = _ref$x === undefined ? 0 : _ref$x,
    _ref$y = _ref.y,
    y = _ref$y === undefined ? 0 : _ref$y

  return { targetTouches: [createClientXY(x, y)], preventDefault: function preventDefault () {} }
}

describe('src/SwipeRow', function () {
  it('render correctly', function () {
    var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_SwipeRow2.default, null))
    expect(wrapper.find('.sr-left-buttons').length).toEqual(1)
    expect(wrapper.find('.sr-right-buttons').length).toEqual(1)
  })

  it('render children correctly', function () {
    var wrapper = (0, _enzyme.mount)(_react2.default.createElement(
      _SwipeRow2.default,
      null,
      _react2.default.createElement(
        'div',
        null,
        'content'
      )
    ))
    expect(wrapper.contains(_react2.default.createElement(
      'div',
      null,
      'content'
    ))).toEqual(true)
  })

  describe('touch event should update state', function () {
    var rightButtons = [_react2.default.createElement(
      'div',
      { style: { padding: '12px', background: 'blue' } },
      'Delete'
    ), _react2.default.createElement(
      'div',
      { style: { padding: '12px', background: 'red' } },
      'Delete'
    ), _react2.default.createElement(
      'div',
      { style: { padding: '12px', background: 'yellow' } },
      'Delete'
    )]
    var leftButtons = [_react2.default.createElement(
      'div',
      { style: { padding: '12px', background: 'gray' } },
      'Mute'
    ), _react2.default.createElement(
      'div',
      { style: { padding: '12px', background: 'orange' } },
      'Mute'
    ), _react2.default.createElement(
      'div',
      { style: { padding: '12px', background: 'pink' } },
      'Mute'
    )]

    var wrapper = void 0
    var touchStartCallback = jest.fn()
    var touchMoveCallback = jest.fn()
    var touchEndCallback = jest.fn()
    beforeEach(function () {
      jest.clearAllMocks()
      wrapper = (0, _enzyme.mount)(_react2.default.createElement(_SwipeRow2.default, {
        rightButtons: rightButtons,
        leftButtons: leftButtons,
        onTouchStart: touchStartCallback,
        onTouchMove: touchMoveCallback,
        onTouchEnd: touchEndCallback
      }))
    })

    describe('touch start should update state', function () {
      it('touch start should update state', function () {
        wrapper.find('.sr-content').simulate('touchstart', createTouchEventObject({ x: 100, y: 50 }))
        var state = wrapper.state()
        expect(state).toHaveProperty('x', 100)
        expect(state).toHaveProperty('y', 50)
        expect(state).toHaveProperty('move', 0)
        expect(state).toHaveProperty('offset', 0)
        expect(state).toHaveProperty('swiping', 0)
      })
    })

    describe('touch move should update state', function () {
      it('vertical swipe should update swiping', function () {
        wrapper.find('.sr-content').simulate('touchstart', createTouchEventObject({ x: 100, y: 50 }))
        wrapper.find('.sr-content').simulate('touchmove', createTouchEventObject({ x: 100, y: 60 }))
        var state = wrapper.state()
        expect(state).toHaveProperty('move', 0)
        expect(state).toHaveProperty('swiping', -1)
        wrapper.find('.sr-content').simulate('touchmove', createTouchEventObject({ x: 100, y: 70 }))
      })
      it('horizontal swipe should update swiping', function () {
        wrapper.find('.sr-content').simulate('touchstart', createTouchEventObject({ x: 100, y: 50 }))
        wrapper.find('.sr-content').simulate('touchmove', createTouchEventObject({ x: 110, y: 50 }))
        var state = wrapper.state()
        expect(state).toHaveProperty('move', 10)
        expect(state).toHaveProperty('swiping', 1)
      })
      it('move left should update buttons visibility', function () {
        wrapper.find('.sr-content').simulate('touchstart', createTouchEventObject({ x: 100, y: 50 }))
        wrapper.find('.sr-content').simulate('touchmove', createTouchEventObject({ x: 250, y: 50 }))
        var state = wrapper.state()
        expect(state).toHaveProperty('move', 150)
        expect(state).toHaveProperty('swiping', 1)
        expect(state).toHaveProperty('leftActionBoxVisibility', true)
        expect(state).toHaveProperty('rightActionBoxVisibility', false)
      })
      it('nonmove should not change move state', function () {
        wrapper.find('.sr-content').simulate('touchstart', createTouchEventObject({ x: 100, y: 50 }))
        wrapper.find('.sr-content').simulate('touchmove', createTouchEventObject({ x: 100, y: 50 }))
        var state = wrapper.state()
        expect(state).toHaveProperty('move', 0)
      })
      it('move right should update buttons visibility', function () {
        wrapper.find('.sr-content').simulate('touchstart', createTouchEventObject({ x: 100, y: 50 }))
        wrapper.find('.sr-content').simulate('touchmove', createTouchEventObject({ x: 50, y: 50 }))
        var state = wrapper.state()
        expect(state).toHaveProperty('move', -50)
        expect(state).toHaveProperty('swiping', 1)
        expect(state).toHaveProperty('leftActionBoxVisibility', false)
        expect(state).toHaveProperty('rightActionBoxVisibility', true)
      })
      it('callback function should called', function () {})
    })

    describe('touch end should update state', function () {
      it('set transition when move end', function () {
        wrapper.find('.sr-content').simulate('touchstart', createTouchEventObject({ x: 100, y: 50 }))
        wrapper.find('.sr-content').simulate('touchmove', createTouchEventObject({ x: 60, y: 50 }))
        wrapper.find('.sr-content').simulate('touchend', createTouchEventObject({ x: 60, y: 50 }))
        expect(touchStartCallback.mock.calls.length).toBe(1)
        expect(touchMoveCallback.mock.calls.length).toBe(1)
        expect(touchEndCallback.mock.calls.length).toBe(1)
        var state = wrapper.state()
        expect(state).toHaveProperty('move', 0)
        expect(state).toHaveProperty('swiping', 0)
        expect(state).toHaveProperty('transition', true)
      })

      it('transitionend should update state', function () {
        wrapper.find('.sr-content').simulate('touchstart', createTouchEventObject({ x: 100, y: 50 }))
        wrapper.find('.sr-content').simulate('transitionend')
        var state = wrapper.state()
        expect(state).toHaveProperty('transition', false)
      })

      it('flick left swipe should update offset to open right buttons', function () {
        wrapper.setState({ rightActionBoxWidth: 100, leftActionBoxWidth: 100 })
        wrapper.find('.sr-content').simulate('touchstart', createTouchEventObject({ x: 100, y: 50 }))
        wrapper.find('.sr-content').simulate('touchmove', createTouchEventObject({ x: 90, y: 50 }))
        wrapper.find('.sr-content').simulate('touchend', createTouchEventObject({ x: 90, y: 50 }))
        var state = wrapper.state()
        expect(state).toHaveProperty('move', 0)
        expect(state).toHaveProperty('offset', -100)
        expect(state).toHaveProperty('swiping', 0)
        expect(state).toHaveProperty('transition', true)
      })

      it('flick right swipe should update offset to open left buttons', function () {
        wrapper.setState({ rightActionBoxWidth: 100, leftActionBoxWidth: 100 })
        wrapper.find('.sr-content').simulate('touchstart', createTouchEventObject({ x: 100, y: 50 }))
        wrapper.find('.sr-content').simulate('touchmove', createTouchEventObject({ x: 110, y: 50 }))
        wrapper.find('.sr-content').simulate('touchend', createTouchEventObject({ x: 110, y: 50 }))
        var state = wrapper.state()
        expect(state).toHaveProperty('move', 0)
        expect(state).toHaveProperty('offset', 100)
        expect(state).toHaveProperty('swiping', 0)
        expect(state).toHaveProperty('transition', true)
      })

      it('nonflick short distance left swipe should not update open buttons', function () {
        wrapper.find('.sr-content').simulate('touchstart', createTouchEventObject({ x: 100, y: 50 }))
        wrapper.setState({
          rightActionBoxWidth: 100,
          leftActionBoxWidth: 100,
          startTime: wrapper.state().startTime - 500
        })
        wrapper.find('.sr-content').simulate('touchmove', createTouchEventObject({ x: 60, y: 50 }))
        wrapper.find('.sr-content').simulate('touchend', createTouchEventObject({ x: 80, y: 50 }))
        var state = wrapper.state()
        expect(state).toHaveProperty('move', 0)
        expect(state).toHaveProperty('swiping', 0)
        expect(state).toHaveProperty('transition', true)
      })

      it('nonflick short distance right swipe should not update open buttons', function () {
        wrapper.find('.sr-content').simulate('touchstart', createTouchEventObject({ x: 100, y: 50 }))
        wrapper.setState({
          rightActionBoxWidth: 100,
          leftActionBoxWidth: 100,
          startTime: wrapper.state().startTime - 500
        })
        wrapper.find('.sr-content').simulate('touchmove', createTouchEventObject({ x: 160, y: 50 }))
        wrapper.find('.sr-content').simulate('touchend', createTouchEventObject({ x: 180, y: 50 }))
        var state = wrapper.state()
        expect(state).toHaveProperty('move', 0)
        expect(state).toHaveProperty('swiping', 0)
        expect(state).toHaveProperty('transition', true)
      })
    })
  })

  describe('props should work', function () {
    it('disable swipe left', function () {
      var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_SwipeRow2.default, { disableSwipeRight: true }))
      wrapper.find('.sr-content').simulate('touchstart', createTouchEventObject({ x: 100, y: 50 }))
      wrapper.find('.sr-content').simulate('touchmove', createTouchEventObject({ x: 250, y: 50 }))
      expect(wrapper.state()).toHaveProperty('move', 0)
    })

    it('disable swipe right', function () {
      var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_SwipeRow2.default, { disableSwipeLeft: true }))
      wrapper.find('.sr-content').simulate('touchstart', createTouchEventObject({ x: 100, y: 50 }))
      wrapper.find('.sr-content').simulate('touchmove', createTouchEventObject({ x: 10, y: 50 }))
      expect(wrapper.state()).toHaveProperty('move', 0)
    })
    it('isClose should reset offset', function () {
      var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_SwipeRow2.default, null))
      wrapper.setState({ offset: 100 })
      expect(wrapper.state().offset).toBe(100)
      wrapper.setProps({ isClose: true })
      expect(wrapper.state().offset).toBe(0)
    })

    it('disable parallax should work', function () {
      var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_SwipeRow2.default, { disableParallax: true }))
      wrapper.find('.sr-content').simulate('touchstart', createTouchEventObject({ x: 100, y: 50 }))
      wrapper.find('.sr-content').simulate('touchmove', createTouchEventObject({ x: 10, y: 50 }))
      expect(wrapper.find('.sr-left-buttons').props().style.left).toEqual(0)
      expect(wrapper.find('.sr-right-buttons').props().style.right).toEqual(0)
    })
  })
})
