import React, { Component } from 'react'
import logo from './logo.svg'
import SwipeRow from './SwipeRow'
import './App.css'

class App extends Component {
  render () {
    return (
      <div className='App'>
        <header className='App-header'>
          <img src={logo} className='App-logo' alt='logo' />
          <h1 className='App-title'>Welcome to React</h1>
        </header>
        <SwipeRow>
          <span>example 1</span>
        </SwipeRow>
        <SwipeRow>
          <span>example 2</span>
        </SwipeRow>
      </div>
    )
  }
}

export default App
