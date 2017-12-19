import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import SwipeRow from '../SwipeRow'

// import '../App.css'

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

storiesOf('SwipeRow', module)
  .add('Simple', () => [1, 2, 3, 4, 5].map(rowId => (
    <SwipeRow
      key={rowId}
      rowId={rowId}
      leftButtons={leftButtons}
      rightButtons={rightButtons}
    >
      <div style={{background: '#fff', padding: '12px', textAlign: 'center'}}>example {rowId.toString()}</div>
    </SwipeRow>
  )))
  .add('Disable swipe right', () => [1, 2, 3, 4, 5].map(rowId => (
    <SwipeRow
      key={rowId}
      rowId={rowId}
      disableSwipeRight
      rightButtons={rightButtons}
    >
      <div style={{background: '#fff', padding: '12px', textAlign: 'center'}}>example {rowId.toString()}</div>
    </SwipeRow>
  )))
  .add('Disable swipe left', () => [1, 2, 3, 4, 5].map(rowId => (
    <SwipeRow
      key={rowId}
      rowId={rowId}
      disableSwipeLeft
      leftButtons={leftButtons}
    >
      <div style={{background: '#fff', padding: '12px', textAlign: 'center'}}>example {rowId.toString()}</div>
    </SwipeRow>
  )))
