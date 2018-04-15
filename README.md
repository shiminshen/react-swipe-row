Swipe Row [![Build Status](https://travis-ci.org/shiminshen/react-swipe-row.svg?branch=master)](https://travis-ci.org/shiminshen/react-swipe-row)
===

A React component implement swipe to show actions.

Development
---

    npm install
    npm start

or use storybook

    npm run storybook

then swipe the row by mobile dev tool!

Usage
---

```javascript
import SwipeRow from 'SwipeRow'

const rowId = 1

<SwipeRow
  rowId={rowId}
  onTouchStart={(e, { x, y, move, offset, ...rest }) => {}}
  rightButtons={[
    <div style={{padding: '12px', background: 'blue'}}>Delete</div>,
    <div style={{padding: '12px', background: 'red'}}>Delete</div>,
    <div style={{padding: '12px', background: 'yellow'}}>Delete</div>
  ]}
  leftButtons={[
    <div style={{padding: '12px', background: 'gray'}}>Mute</div>,
    <div style={{padding: '12px', background: 'pink'}}>Mute</div>
  ]}
  disableSwipeLeft
>
  <div style={{background: '#fff', padding: '12px', textAlign: 'center'}}>
    example {rowId.toString()}
  </div>
</SwipeRow>

```
API
---

#### SwipeRow
| name                   | description            | type    | default |
|------------------------|------------------------|--------- |---------|
|  onTouchStart          |                        | Function |         |
|  onTouchMove           |                        | Function |         |
|  onTouchEnd            |                        | Function |         |
|  leftButtons           | Components which reveals on left  | Array of React Components   | [ ] |
|  rightButtons          | Components which reveals on right | Array of React Components   | [ ] |
|  className             | ClassName for wrapper div  | String   |''       |
|  deltaThreshold        | Threshold of swiping direction track | number | 10       |
|  flickThreshold        | Threshold of flick swiping comfirmation | number | 200      |
|  transitionFunc        | CSS transition to complete swipe | String | 'all 0.3s cubic-bezier(0, 0, 0, 1)' |
|  disableSwipeLeft      | Disable swipe left     | Boolean  | false |
|  disableSwipeRight     | Disable swipe right    | Boolean  | false |

#### Event Props
```onTouchStart```, ```onTouchMove``` and ```onTouchEnd``` are the callback event with corresponding event as the first parameter and the state of each threshold as the second parameter.
