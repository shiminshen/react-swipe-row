import React from 'react'
import SwipeRow from './SwipeRow.js'
import Enzyme, {shallow} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({adapter: new Adapter()})

describe('src/SwipeRow', () => {
  it('render correctly', () => {
    const wrapper = shallow(<SwipeRow />)
    expect(wrapper.find('.sr-left-buttons').length).toEqual(1)
    expect(wrapper.find('.sr-right-buttons').length).toEqual(1)
  })

  it('render children correctly', () => {
    const wrapper = shallow(
      <SwipeRow>
        <div>content</div>
      </SwipeRow>
    )
    expect(wrapper.contains(<div>content</div>)).toEqual(true)
  })

  describe('touch event should update state', function () {
    const rightButtons = [
      <div style={{padding: '12px', background: 'blue'}}>Delete</div>,
      <div style={{padding: '12px', background: 'red'}}>Delete</div>,
      <div style={{padding: '12px', background: 'yellow'}}>Delete</div>
    ]
    const leftButtons = [
      <div style={{padding: '12px', background: 'gray'}}>Mute</div>,
      <div style={{padding: '12px', background: 'orange'}}>Mute</div>,
      <div style={{padding: '12px', background: 'pink'}}>Mute</div>
    ]

    let wrapper
    beforeEach(() => {
      wrapper = shallow(
        <SwipeRow rightButtons={rightButtons} leftButtons={leftButtons} />
      )
    })

    describe('touch start should update state', () => {
      it('touch start should update state', () => {
        wrapper
          .find('.sr-content')
          .simulate('touchstart', {clientX: 100, clientY: 50})
        const state = wrapper.state()
        expect(state).toMatchObject({
          x: 100,
          y: 50,
          move: 0,
          offset: 0,
          swiping: 0
        })
      })
    })

    describe('touch move should update state', () => {
      it('vertical swipe should update swiping', () => {
        wrapper
          .find('.sr-content')
          .simulate('touchstart', {clientX: 100, clientY: 50})
        wrapper
          .find('.sr-content')
          .simulate('touchmove', {clientX: 100, clientY: 60})
        expect(wrapper.state()).toMatchObject({move: 0, swiping: -1})
        wrapper
          .find('.sr-content')
          .simulate('touchmove', {clientX: 100, clientY: 70})
      })

      it('horizontal swipe should update swiping', () => {
        wrapper
          .find('.sr-content')
          .simulate('touchstart', {clientX: 100, clientY: 50})
        wrapper
          .find('.sr-content')
          .simulate('touchmove', {clientX: 110, clientY: 50})
        expect(wrapper.state()).toMatchObject({move: 10, swiping: 1})
      })

      it('move left should update buttons visibility', () => {
        wrapper
          .find('.sr-content')
          .simulate('touchstart', {clientX: 100, clientY: 50})
        wrapper
          .find('.sr-content')
          .simulate('touchmove', {clientX: 250, clientY: 50})
        expect(wrapper.state()).toMatchObject({
          move: 150,
          swiping: 1,
          leftActionBoxVisibility: true,
          rightActionBoxVisibility: false
        })
      })

      it('nonmove should not change move state', () => {
        wrapper
          .find('.sr-content')
          .simulate('touchstart', {clientX: 100, clientY: 50})
        wrapper
          .find('.sr-content')
          .simulate('touchmove', {clientX: 100, clientY: 50})
        expect(wrapper.state()).toMatchObject({move: 0, swiping: 0})
      })

      it('move right should update buttons visibility', () => {
        wrapper
          .find('.sr-content')
          .simulate('touchstart', {clientX: 100, clientY: 50})
        wrapper
          .find('.sr-content')
          .simulate('touchmove', {clientX: 50, clientY: 50})
        expect(wrapper.state()).toMatchObject({
          move: -50,
          swiping: 1,
          leftActionBoxVisibility: false,
          rightActionBoxVisibility: true
        })
      })
    })

    describe('touch end should update state', function () {
      it('set transition when move end', () => {
        wrapper
          .find('.sr-content')
          .simulate('touchstart', {clientX: 100, clientY: 50})
        wrapper
          .find('.sr-content')
          .simulate('touchmove', {clientX: 60, clientY: 50})
        wrapper
          .find('.sr-content')
          .simulate('touchend', {clientX: 60, clientY: 50})
        expect(wrapper.state()).toMatchObject({
          move: 0,
          swiping: 0,
          transition: true
        })
      })

      it('transitionend should set tansition state to false', () => {
        wrapper
          .find('.sr-content')
          .simulate('touchstart', {clientX: 100, clientY: 50})
        wrapper.find('.sr-content').simulate('transitionend')
        expect(wrapper.state()).toMatchObject({
          transition: false
        })
      })

      it('flick left swipe should update offset to open right buttons', () => {
        wrapper.setState({rightActionBoxWidth: 100, leftActionBoxWidth: 200})
        wrapper
          .find('.sr-content')
          .simulate('touchstart', {clientX: 100, clientY: 50})
        wrapper
          .find('.sr-content')
          .simulate('touchmove', {clientX: 90, clientY: 50})
        wrapper
          .find('.sr-content')
          .simulate('touchend', {clientX: 90, clientY: 50})
        expect(wrapper.state()).toMatchObject({
          move: 0,
          offset: -100,
          swiping: 0,
          transition: true
        })
      })

      it('flick right swipe should update offset to open left buttons', () => {
        wrapper.setState({rightActionBoxWidth: 100, leftActionBoxWidth: 200})
        wrapper
          .find('.sr-content')
          .simulate('touchstart', {clientX: 100, clientY: 50})
        wrapper
          .find('.sr-content')
          .simulate('touchmove', {clientX: 110, clientY: 50})
        wrapper
          .find('.sr-content')
          .simulate('touchend', {clientX: 110, clientY: 50})
        expect(wrapper.state()).toMatchObject({
          move: 0,
          offset: 200,
          swiping: 0,
          transition: true
        })
      })

      it('nonflick swipe should not set offset on touchend', () => {
        wrapper
          .find('.sr-content')
          .simulate('touchstart', {clientX: 100, clientY: 50})
        wrapper.setState({
          rightActionBoxWidth: 100,
          leftActionBoxWidth: 200,
          startTime: wrapper.state().startTime - 500
        })
        wrapper
          .find('.sr-content')
          .simulate('touchmove', {clientX: 110, clientY: 50})
        wrapper
          .find('.sr-content')
          .simulate('touchend', {clientX: 110, clientY: 50})
        expect(wrapper.state()).toMatchObject({
          move: 0,
          offset: 0,
          swiping: 0,
          transition: true
        })
      })
    })
  })

  describe('disable props should work', function () {
    it('disable swipe left', function () {
      const wrapper = shallow(<SwipeRow disableSwipeRight />)
      wrapper
        .find('.sr-content')
        .simulate('touchstart', {clientX: 100, clientY: 50})
      wrapper
        .find('.sr-content')
        .simulate('touchmove', {clientX: 250, clientY: 50})
      expect(wrapper.state()).toHaveProperty('move', 0)
    })

    it('disable swipe right', function () {
      const wrapper = shallow(<SwipeRow disableSwipeLeft />)
      wrapper
        .find('.sr-content')
        .simulate('touchstart', {clientX: 100, clientY: 50})
      wrapper
        .find('.sr-content')
        .simulate('touchmove', {clientX: 10, clientY: 50})
      expect(wrapper.state()).toHaveProperty('move', 0)
    })
  })
})
