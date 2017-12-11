import React, { Component } from 'react'
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css'

class SwipeRow extends Component {
  constructor (props) {
    super(props)

    this.state = {
      x: 0,
      y: 0,
      swiping: false,
      move: 0,
      actionBoxWidth: 0
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
      y: this.state.actionBoxWidth,
      swiping: false,
      move: -this.state.actionBoxWidth
    }, () => cb && cb(this.props.rowId))
  }

  handleTouchMove = cb => e => {
    this.setState({
      move: (e.clientX || e.targetTouches[0].clientX) - this.state.x
    }, () => cb && cb(this.props.rowId))
  }

  componentDidMount() {
    this.setState({
      actionBoxWidth: this.actionBox.getBoundingClientRect().width
    })
  }

  render () {
    let {
      touchStartCallback,
      touchEndCallback,
      touchMoveCallback,
      className,
      children
    } = this.props

    const swipeRowStyle = {
      position: 'relative',
      left: this.state.move,
      transition: this.state.swiping ? '' : 'all .7s cubic-bezier(0, 0, 0, 1)'
    }

    const actionBoxStyle = {
      position: 'absolute',
      top: 0,
      right: 0
    }

    return (
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <div
          className={className}
          style={swipeRowStyle}
          onTouchStart={this.handleTouchStart(touchStartCallback)}
          onTouchEnd={this.handleTouchEnd(touchEndCallback)}
          onTouchMove={this.handleTouchMove(touchMoveCallback)}
          onMouseDown={this.handleTouchStart(touchStartCallback)}
          onMouseUp={this.handleTouchEnd(touchEndCallback)}
          onMouseMove={this.state.swiping ? this.handleTouchMove(touchMoveCallback) : () => {}}
        >
          { children.props.children[0] }
        </div>
        <div ref={ el => this.actionBox = el } className='actionBox' style={actionBoxStyle}>
          { children.props.children[1] }
        </div>
      </div>
    )
  }
}

export default SwipeRow
