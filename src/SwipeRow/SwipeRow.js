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

  handleTouchStart = cb => e => {
    this.setState({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    }, () => cb && cb(this.props.rowId))
  }

  handleTouchEnd = cb => e => {
    console.log(this.props);
    this.setState({
      x: 0,
      y: 0,
      move: 0
    }, () => cb && cb(this.props.rowId))
  }

  handleTouchMove = cb => e => {
    this.setState({
      move: e.targetTouches[0].clientX - this.state.x
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
        >
          { children }
        </div>
      </div>
    )
  }
}

export default SwipeRow
