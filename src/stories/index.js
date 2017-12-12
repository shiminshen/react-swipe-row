import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { linkTo } from '@storybook/addon-links'

import { Button, Welcome } from '@storybook/react/demo'
import { SwipeRow, Action } from '../SwipeRow'

import '../App.css'

storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')} />)

storiesOf('Button', module)
  .add('with text', () => <Button onClick={action('clicked')}>Hello Button</Button>)
  .add('with some emoji', () => <Button onClick={action('clicked')}>😀 😎 👍 💯</Button>)

storiesOf('SwipeRow', module)
  .add('with text', () => [1, 2, 3, 4, 5].map(rowId => (
    <SwipeRow
      key={rowId}
      rowId={rowId}
    >
      <div className='rowContent'>example {rowId.toString()}</div>
      <Action right className='backAction'>Delete</Action>
      <Action left className='backAction'>Delete</Action>
      <Action right className='backAction'>Delete</Action>
    </SwipeRow>
  )))
  .add('with some emoji', () => <Button onClick={action('clicked')}>😀 😎 👍 💯</Button>)
