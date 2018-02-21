import React from 'react'
import SwipeRow from './SwipeRow'
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new Adapter() })

function createClientXY (x, y) {
  return { clientX: x, clientY: y }
}

function createTouchEventObject ({ x = 0, y = 0 }) {
  return { targetTouches: [createClientXY(x, y)], preventDefault: () => {} }
}

describe('src/SwipeRow', () => {
  it('render correctly', () => {
    const wrapper = mount(<SwipeRow />)
    expect(wrapper.find('.sr-left-buttons').length).toEqual(1)
    expect(wrapper.find('.sr-right-buttons').length).toEqual(1)
  })

  it('render children correctly', () => {
    const wrapper = mount(
      <SwipeRow>
        <div>content</div>
      </SwipeRow>
    )
    expect(wrapper.contains(<div>content</div>)).toEqual(true)
  })

  describe('touch event should update state', () => {
    const rightButtons = [
      <div style={{ padding: '12px', background: 'blue' }}>Delete</div>,
      <div style={{ padding: '12px', background: 'red' }}>Delete</div>,
      <div style={{ padding: '12px', background: 'yellow' }}>Delete</div>
    ]
    const leftButtons = [
      <div style={{ padding: '12px', background: 'gray' }}>Mute</div>,
      <div style={{ padding: '12px', background: 'orange' }}>Mute</div>,
      <div style={{ padding: '12px', background: 'pink' }}>Mute</div>
    ]

    let wrapper
    const touchStartCallback = jest.fn()
    const touchMoveCallback = jest.fn()
    const touchEndCallback = jest.fn()
    beforeEach(() => {
      jest.clearAllMocks()
      wrapper = mount(
        <SwipeRow
          rightButtons={rightButtons}
          leftButtons={leftButtons}
          onTouchStart={touchStartCallback}
          onTouchMove={touchMoveCallback}
          onTouchEnd={touchEndCallback}
        />
      )
    })

    describe('touch start should update state', () => {
      it('touch start should update state', () => {
        wrapper
          .find('.sr-content')
          .simulate('touchstart', createTouchEventObject({ x: 100, y: 50 }))
        const state = wrapper.state()
        expect(state).toHaveProperty('x', 100)
        expect(state).toHaveProperty('y', 50)
        expect(state).toHaveProperty('move', 0)
        expect(state).toHaveProperty('offset', 0)
        expect(state).toHaveProperty('swiping', 0)
      })
    })

    describe('touch move should update state', () => {
      it('vertical swipe should update swiping', () => {
        wrapper
          .find('.sr-content')
          .simulate('touchstart', createTouchEventObject({ x: 100, y: 50 }))
        wrapper
          .find('.sr-content')
          .simulate('touchmove', createTouchEventObject({ x: 100, y: 60 }))
        const state = wrapper.state()
        expect(state).toHaveProperty('move', 0)
        expect(state).toHaveProperty('swiping', -1)
        wrapper
          .find('.sr-content')
          .simulate('touchmove', createTouchEventObject({ x: 100, y: 70 }))
      })
      it('horizontal swipe should update swiping', () => {
        wrapper
          .find('.sr-content')
          .simulate('touchstart', createTouchEventObject({ x: 100, y: 50 }))
        wrapper
          .find('.sr-content')
          .simulate('touchmove', createTouchEventObject({ x: 110, y: 50 }))
        const state = wrapper.state()
        expect(state).toHaveProperty('move', 10)
        expect(state).toHaveProperty('swiping', 1)
      })
      it('move left should update buttons visibility', () => {
        wrapper
          .find('.sr-content')
          .simulate('touchstart', createTouchEventObject({ x: 100, y: 50 }))
        wrapper
          .find('.sr-content')
          .simulate('touchmove', createTouchEventObject({ x: 250, y: 50 }))
        const state = wrapper.state()
        expect(state).toHaveProperty('move', 150)
        expect(state).toHaveProperty('swiping', 1)
        expect(state).toHaveProperty('leftActionBoxVisibility', true)
        expect(state).toHaveProperty('rightActionBoxVisibility', false)
      })
      it('nonmove should not change move state', () => {
        wrapper
          .find('.sr-content')
          .simulate('touchstart', createTouchEventObject({ x: 100, y: 50 }))
        wrapper
          .find('.sr-content')
          .simulate('touchmove', createTouchEventObject({ x: 100, y: 50 }))
        const state = wrapper.state()
        expect(state).toHaveProperty('move', 0)
      })
      it('move right should update buttons visibility', () => {
        wrapper
          .find('.sr-content')
          .simulate('touchstart', createTouchEventObject({ x: 100, y: 50 }))
        wrapper
          .find('.sr-content')
          .simulate('touchmove', createTouchEventObject({ x: 50, y: 50 }))
        const state = wrapper.state()
        expect(state).toHaveProperty('move', -50)
        expect(state).toHaveProperty('swiping', 1)
        expect(state).toHaveProperty('leftActionBoxVisibility', false)
        expect(state).toHaveProperty('rightActionBoxVisibility', true)
      })
      it('callback function should called', () => {})
    })

    describe('touch end should update state', () => {
      it('set transition when move end', () => {
        wrapper
          .find('.sr-content')
          .simulate('touchstart', createTouchEventObject({ x: 100, y: 50 }))
        wrapper
          .find('.sr-content')
          .simulate('touchmove', createTouchEventObject({ x: 60, y: 50 }))
        wrapper
          .find('.sr-content')
          .simulate('touchend', createTouchEventObject({ x: 60, y: 50 }))
        expect(touchStartCallback.mock.calls.length).toBe(1)
        expect(touchMoveCallback.mock.calls.length).toBe(1)
        expect(touchEndCallback.mock.calls.length).toBe(1)
        const state = wrapper.state()
        expect(state).toHaveProperty('move', 0)
        expect(state).toHaveProperty('swiping', 0)
        expect(state).toHaveProperty('transition', true)
      })

      it('transitionend should update state', () => {
        wrapper
          .find('.sr-content')
          .simulate('touchstart', createTouchEventObject({ x: 100, y: 50 }))
        wrapper.find('.sr-content').simulate('transitionend')
        const state = wrapper.state()
        expect(state).toHaveProperty('transition', false)
      })

      it('flick left swipe should update offset to open right buttons', () => {
        wrapper.setState({ rightActionBoxWidth: 100, leftActionBoxWidth: 100 })
        wrapper
          .find('.sr-content')
          .simulate('touchstart', createTouchEventObject({ x: 100, y: 50 }))
        wrapper
          .find('.sr-content')
          .simulate('touchmove', createTouchEventObject({ x: 90, y: 50 }))
        wrapper
          .find('.sr-content')
          .simulate('touchend', createTouchEventObject({ x: 90, y: 50 }))
        const state = wrapper.state()
        expect(state).toHaveProperty('move', 0)
        expect(state).toHaveProperty('offset', -100)
        expect(state).toHaveProperty('swiping', 0)
        expect(state).toHaveProperty('transition', true)
      })

      it('flick right swipe should update offset to open left buttons', () => {
        wrapper.setState({ rightActionBoxWidth: 100, leftActionBoxWidth: 100 })
        wrapper
          .find('.sr-content')
          .simulate('touchstart', createTouchEventObject({ x: 100, y: 50 }))
        wrapper
          .find('.sr-content')
          .simulate('touchmove', createTouchEventObject({ x: 110, y: 50 }))
        wrapper
          .find('.sr-content')
          .simulate('touchend', createTouchEventObject({ x: 110, y: 50 }))
        const state = wrapper.state()
        expect(state).toHaveProperty('move', 0)
        expect(state).toHaveProperty('offset', 100)
        expect(state).toHaveProperty('swiping', 0)
        expect(state).toHaveProperty('transition', true)
      })

      it('nonflick short distance left swipe should not update open buttons', () => {
        wrapper
          .find('.sr-content')
          .simulate('touchstart', createTouchEventObject({ x: 100, y: 50 }))
        wrapper.setState({
          rightActionBoxWidth: 100,
          leftActionBoxWidth: 100,
          startTime: wrapper.state().startTime - 500
        })
        wrapper
          .find('.sr-content')
          .simulate('touchmove', createTouchEventObject({ x: 60, y: 50 }))
        wrapper
          .find('.sr-content')
          .simulate('touchend', createTouchEventObject({ x: 80, y: 50 }))
        const state = wrapper.state()
        expect(state).toHaveProperty('move', 0)
        expect(state).toHaveProperty('swiping', 0)
        expect(state).toHaveProperty('transition', true)
      })

      it('nonflick short distance right swipe should not update open buttons', () => {
        wrapper
          .find('.sr-content')
          .simulate('touchstart', createTouchEventObject({ x: 100, y: 50 }))
        wrapper.setState({
          rightActionBoxWidth: 100,
          leftActionBoxWidth: 100,
          startTime: wrapper.state().startTime - 500
        })
        wrapper
          .find('.sr-content')
          .simulate('touchmove', createTouchEventObject({ x: 160, y: 50 }))
        wrapper
          .find('.sr-content')
          .simulate('touchend', createTouchEventObject({ x: 180, y: 50 }))
        const state = wrapper.state()
        expect(state).toHaveProperty('move', 0)
        expect(state).toHaveProperty('swiping', 0)
        expect(state).toHaveProperty('transition', true)
      })
    })
  })

  describe('props should work', () => {
    it('disable swipe left', () => {
      const wrapper = mount(<SwipeRow disableSwipeRight />)
      wrapper
        .find('.sr-content')
        .simulate('touchstart', createTouchEventObject({ x: 100, y: 50 }))
      wrapper
        .find('.sr-content')
        .simulate('touchmove', createTouchEventObject({ x: 250, y: 50 }))
      expect(wrapper.state()).toHaveProperty('move', 0)
    })

    it('disable swipe right', () => {
      const wrapper = mount(<SwipeRow disableSwipeLeft />)
      wrapper
        .find('.sr-content')
        .simulate('touchstart', createTouchEventObject({ x: 100, y: 50 }))
      wrapper
        .find('.sr-content')
        .simulate('touchmove', createTouchEventObject({ x: 10, y: 50 }))
      expect(wrapper.state()).toHaveProperty('move', 0)
    })
    it('isClose should reset offset', () => {
      const wrapper = mount(<SwipeRow />)
      wrapper.setState({ offset: 100 })
      expect(wrapper.state().offset).toBe(100)
      wrapper.setProps({ isClose: true })
      expect(wrapper.state().offset).toBe(0)
    })

    it('disable parallax should work', () => {
      const wrapper = mount(<SwipeRow disableParallax />)
      wrapper
        .find('.sr-content')
        .simulate('touchstart', createTouchEventObject({ x: 100, y: 50 }))
      wrapper
        .find('.sr-content')
        .simulate('touchmove', createTouchEventObject({ x: 10, y: 50 }))
      expect(wrapper.find('.sr-left-buttons').props().style.left).toEqual(0)
      expect(wrapper.find('.sr-right-buttons').props().style.right).toEqual(0)
    })
  })
})
