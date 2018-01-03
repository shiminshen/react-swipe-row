Swipe Row [![Build Status](https://travis-ci.org/shiminshen/react-swipe-row.svg?branch=master)](https://travis-ci.org/shiminshen/react-swipe-row)
===

A React component implement swipe to show actions.

Development
---

    npm install
    npm start

or use storybook

    npm run storybook


Usage
---

```javascript
import { SwipeRow, SwipeAction } from 'SwipeRow'

const rowId = 1

<SwipeRow
  rowId={rowId}
  disableSwipeLeft
>
  <div style={{background: '#fff', padding: '12px', textAlign: 'center'}}>example {rowId.toString()}</div>
  <SwipeAction left style={{padding: '12px', background: 'gray'}}>Mute</SwipeAction>
  <SwipeAction right style={{padding: '12px', background: 'blue'}}>Edit</SwipeAction>
  <SwipeAction right style={{padding: '12px', background: 'red'}}>Delete</SwipeAction>
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

