import React, { Component } from 'react'
import logo from './logo.svg'
import { SwipeRow, SwipeAction } from './SwipeRow'
import './App.css'

import '../node_modules/bootstrap/dist/css/bootstrap.min.css'

class App extends Component {
  constructor (props) {
    super(props)

    this.state = {
      list: [4, 5, 6, 7, 8]
    }
  }

  render () {
    return (
      <div className='App'>
        <header className='App-header'>
          <img src={logo} className='App-logo' alt='logo' />
          <h1 className='App-title'>Swipe Row</h1>
        </header>
        {
          this.state.list.map(rowId => (
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
          ))
        }
      </div>
    )
  }
}

export default App
