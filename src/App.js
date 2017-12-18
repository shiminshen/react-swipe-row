import React, { Component } from 'react'
import logo from './logo.svg'
import { SwipeRow, SwipeAction } from './SwipeRow'
import './App.css'

import '../node_modules/bootstrap/dist/css/bootstrap.min.css'

class App extends Component {
  constructor (props) {
    super(props)

    this.state = {
      list: [1, 2, 3, 4, 5]
    }
  }

  render () {
    return (
      <div className='App'>
        <header className='App-header'>
          <img src={logo} className='App-logo' alt='logo' />
          <h1 className='App-title'>Swipe Row</h1>
        </header>
        <h3>Normal</h3>
        {
          this.state.list.map(rowId => (
            <SwipeRow
              key={rowId}
              rowId={rowId}
            >
              <div style={{background: '#fff', padding: '12px', textAlign: 'center'}}>example {rowId.toString()}</div>
              <SwipeAction left style={{padding: '12px', background: 'gray'}}>Mute</SwipeAction>
              <SwipeAction left style={{padding: '12px', background: 'orange'}}>Mute</SwipeAction>
              <SwipeAction left style={{padding: '12px', background: 'pink'}}>Mute</SwipeAction>
              <SwipeAction right style={{padding: '12px', background: 'blue'}}>Delete</SwipeAction>
              <SwipeAction right style={{padding: '12px', background: 'red'}}>Delete</SwipeAction>
              <SwipeAction right style={{padding: '12px', background: 'yellow'}}>Delete</SwipeAction>
            </SwipeRow>
          ))
        }
        <hr />
        <h3>Disable Parallax</h3>
        {
          this.state.list.map(rowId => (
            <SwipeRow
              key={rowId}
              rowId={rowId}
              disableParallax
            >
              <div style={{background: '#fff', padding: '12px', textAlign: 'center'}}>example {rowId.toString()}</div>
              <SwipeAction left style={{padding: '12px', background: 'gray'}}>Mute</SwipeAction>
              <SwipeAction left style={{padding: '12px', background: 'orange'}}>Mute</SwipeAction>
              <SwipeAction left style={{padding: '12px', background: 'pink'}}>Mute</SwipeAction>
              <SwipeAction right style={{padding: '12px', background: 'blue'}}>Delete</SwipeAction>
              <SwipeAction right style={{padding: '12px', background: 'red'}}>Delete</SwipeAction>
              <SwipeAction right style={{padding: '12px', background: 'yellow'}}>Delete</SwipeAction>
            </SwipeRow>
          ))

        }
        <hr />
        <h3>Disable Right Swipe</h3>
        {
          this.state.list.map(rowId => (
            <SwipeRow
              key={rowId}
              rowId={rowId}
              disableSwipeRight
            >
              <div style={{background: '#fff', padding: '12px', textAlign: 'center'}}>example {rowId.toString()}</div>
              <SwipeAction left style={{padding: '12px', background: 'gray'}}>Mute</SwipeAction>
              <SwipeAction left style={{padding: '12px', background: 'orange'}}>Mute</SwipeAction>
              <SwipeAction left style={{padding: '12px', background: 'pink'}}>Mute</SwipeAction>
              <SwipeAction right style={{padding: '12px', background: 'blue'}}>Delete</SwipeAction>
              <SwipeAction right style={{padding: '12px', background: 'red'}}>Delete</SwipeAction>
              <SwipeAction right style={{padding: '12px', background: 'yellow'}}>Delete</SwipeAction>
            </SwipeRow>
          ))
        }
      </div>
    )
  }
}

export default App
