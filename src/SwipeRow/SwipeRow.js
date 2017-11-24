import React, { Component } from 'react'
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css'

class SwipeRow extends Component {
  constructor (props) {
    super(props)

    this.state = {
      x: 0,
      y: 0,
      move: 0
    }
  }

  handleTouchStart = (e) => {
    this.setState({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    })
  }

  handleTouchEnd = (e) => {
    this.setState({
      x: 0,
      y: 0,
      move: 0
    })
  }

  handleTouchMove = (e) => {
    this.setState({
      move: e.targetTouches[0].clientX - this.state.x
    })
  }

  render () {
    let {
      children
    } = this.props

    console.log(this.state);
    return (
      <div style={{ width: '100%', overflow: 'hidden' }}>
        <div
          className='p-3 bg-light'
          style={{ position: 'relative', left: this.state.move}}
          onTouchStart={this.handleTouchStart}
          onTouchEnd={this.handleTouchEnd}
          onTouchMove={this.handleTouchMove}
        >
          { children }
        </div>
      </div>
    )
  }
}

export default SwipeRow
