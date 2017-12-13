Swipe Row
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
  key={rowId}
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
|  touchStartCallback    |                        | Function |         |
|  touchMoveCallback     |                        | Function |         |
|  touchEndCallback      |                        | Function |         |
|  className             | ClassName for wrapper div  | String   |''       |
|  transitionFunc        | CSS transition to complete swipe | String | 'all 0.7s cubic-bezier(0, 0, 0, 1)' |
|  disableSwipeLeft      | Disable swipe left     | Boolean  | false |
|  disableSwipeRight     | Disable swipe right    | Boolean  | false |


#### SwipeAction
| name                   | description            | type    | default |
|------------------------|------------------------|---------|---------|
| left                   | Let action in left Box | Boolean | false   |
| right                  | Let action in right Box| Boolean | false   |

