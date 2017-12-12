import React, { Component } from 'react'
import logo from './logo.svg'
import { SwipeRow, Action } from './SwipeRow'
import './App.css'

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
              className='swipeRow'
              key={rowId}
              rowId={rowId}
            >
              <div className='rowContent'>example {rowId.toString()}</div>
              <Action right className='backAction'>Delete</Action>
              <Action left className='backAction'>Delete</Action>
              <Action right className='backAction'>Delete</Action>
            </SwipeRow>
          ))
        }
      </div>
    )
  }
}

export default App
