import React, { Component } from 'react'
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css'

class SwipeRow extends Component {
  constructor (props) {
    super(props)

    this.state = {
      x: 0,
      y: 0,
      swiping: false,
      move: 0
    }
  }

  handleTouchStart = cb => e => {
    this.setState({
      x: e.clientX || e.targetTouches[0].clientX,
      y: e.clientY || e.targetTouches[0].clientY,
      swiping: true
    }, () => cb && cb(this.props.rowId))
  }

  handleTouchEnd = cb => e => {
    this.setState({
      x: 0,
      y: 0,
      swiping: false,
      move: 0
    }, () => cb && cb(this.props.rowId))
  }

  handleTouchMove = cb => e => {
    this.setState({
      move: (e.clientX || e.targetTouches[0].clientX) - this.state.x
    }, () => cb && cb(this.props.rowId))
  }

  render () {
    let {
      touchStartCallback,
      touchEndCallback,
      touchMoveCallback,
      children
    } = this.props

    return (
      <div style={{ overflow: 'hidden' }}>
        <div
          className='p-3 bg-light'
          style={{ position: 'relative', left: this.state.move }}
          onTouchStart={this.handleTouchStart(touchStartCallback)}
          onTouchEnd={this.handleTouchEnd(touchEndCallback)}
          onTouchMove={this.handleTouchMove(touchMoveCallback)}
          onMouseDown={this.handleTouchStart(touchStartCallback)}
          onMouseUp={this.handleTouchEnd(touchEndCallback)}
          onMouseMove={this.state.swiping ? this.handleTouchMove(touchMoveCallback) : () => {}}
        >
          { children }
        </div>
      </div>
    )
  }
}

export default SwipeRow
