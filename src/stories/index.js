import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { linkTo } from '@storybook/addon-links'

import { Button, Welcome } from '@storybook/react/demo'
import { SwipeRow, SwipeAction } from '../SwipeRow'

// import '../App.css'

storiesOf('SwipeRow', module)
  .add('Simple', () => [1, 2, 3, 4, 5].map(rowId => (
    <SwipeRow
      key={rowId}
      rowId={rowId}
    >
      <div style={{background: '#fff', padding: '12px', textAlign: 'center'}}>example {rowId.toString()}</div>
      <SwipeAction left style={{padding: '12px', background: 'gray'}}>Mute</SwipeAction>
      <SwipeAction right style={{padding: '12px', background: 'blue'}}>Edit</SwipeAction>
      <SwipeAction right style={{padding: '12px', background: 'red'}}>Delete</SwipeAction>
    </SwipeRow>
  )))
  .add('Disable swipe right', () => [1, 2, 3, 4, 5].map(rowId => (
    <SwipeRow
      key={rowId}
      rowId={rowId}
      disableSwipeRight
    >
      <div style={{background: '#fff', padding: '12px', textAlign: 'center'}}>example {rowId.toString()}</div>
      <SwipeAction left style={{padding: '12px', background: 'gray'}}>Mute</SwipeAction>
      <SwipeAction right style={{padding: '12px', background: 'blue'}}>Edit</SwipeAction>
      <SwipeAction right style={{padding: '12px', background: 'red'}}>Delete</SwipeAction>
    </SwipeRow>
  )))
