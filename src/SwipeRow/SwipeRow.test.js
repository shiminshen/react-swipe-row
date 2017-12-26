import React from 'react'
import SwipeRow from './SwipeRow.js'
import Enzyme, { shallow, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new Adapter() })

it('render correctly', () => {
  const wrapper = shallow((
    <SwipeRow />
  ))
  expect(wrapper.find('.sr-content').length).toEqual(1)
  expect(wrapper.find('.sr-left-buttons').length).toEqual(1)
  expect(wrapper.find('.sr-right-buttons').length).toEqual(1)
})

it('render children correctly', () => {
  const wrapper = shallow((
    <SwipeRow>
      <div>contain</div>
    </SwipeRow>
  ))
  expect(wrapper.contains(<div>contain</div>)).toEqual(true)
})

it('render children correctly', () => {
  const wrapper = shallow((
    <SwipeRow>
      <div>contain</div>
    </SwipeRow>
  ))
  expect(wrapper.contains(<div>contain</div>)).toEqual(true)
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
  const wrapper = mount((
    <SwipeRow
      rightButtons={rightButtons}
      leftButtons={leftButtons}
    />
  ))

  it('touch start should update state', () => {
    wrapper.find('.sr-content').simulate('touchstart', { clientX: 100, clientY: 50 })
    const state = wrapper.state()
    expect(state).toHaveProperty('x', 100)
    expect(state).toHaveProperty('y', 50)
    expect(state).toHaveProperty('move', 0)
    expect(state).toHaveProperty('offset', 0)
    expect(state).toHaveProperty('swiping', true)
  })

  it('move left should update state', () => {
    wrapper.find('.sr-content').simulate('touchmove', { clientX: 250, clientY: 50 })
    const state = wrapper.state()
    expect(state).toHaveProperty('move', 150)
    expect(state).toHaveProperty('swiping', true)
    expect(state).toHaveProperty('leftActionBoxVisibility', true)
    expect(state).toHaveProperty('rightActionBoxVisibility', false)
  })
  it('move right should update state', () => {
    wrapper.find('.sr-content').simulate('touchmove', { clientX: 50, clientY: 50 })
    const state = wrapper.state()
    expect(state).toHaveProperty('move', -50)
    expect(state).toHaveProperty('swiping', true)
    expect(state).toHaveProperty('leftActionBoxVisibility', false)
    expect(state).toHaveProperty('rightActionBoxVisibility', true)
  })
})
