import React, { Component } from 'react'
import logo from './logo.svg'
import SwipeRow from './SwipeRow'
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
          <h1 className='App-title'>Welcome to React</h1>
        </header>
        {
          this.state.list.map(rowId => (
            <SwipeRow
              key={rowId}
              rowId={rowId}
              touchEndCallback={() => this.setState({
                list: this.state.list.filter(val => rowId !== val)
              })}
            >
              <span>example {rowId.toString()}</span>
            </SwipeRow>
          ))
        }
      </div>
    )
  }
}

export default App
