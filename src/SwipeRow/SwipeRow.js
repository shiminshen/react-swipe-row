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
      offset: 0,
      actionBoxWidth: 0
    }
  }

  handleTouchStart = cb => e => {
    this.setState({
      x: (e.clientX || e.targetTouches[0].clientX),
      y: e.clientY || e.targetTouches[0].clientY,
      swiping: true
    }, () => cb && cb(this.props.rowId))
  }

  handleTouchEnd = cb => e => {
    const direction = this.state.move > 0 ? 1 : -1
    const destPosition = this.state.move + this.state.offset
    console.log(direction);
    console.log(destPosition);
    console.log(this.state);
    let offset = 0
    if (direction > 0) {
      offset = -1 * destPosition > (this.state.actionBoxWidth / 2) ? -this.state.actionBoxWidth : 0
    } else {
      offset = direction * destPosition > (this.state.actionBoxWidth / 2) ? direction * this.state.actionBoxWidth : 0
    }

    this.setState({
      x: 0,
      y: 0,
      swiping: false,
      offset: offset,
      move: 0
    }, () => cb && cb(this.props.rowId))
  }

  handleTouchMove = cb => e => {
    console.log(this.state);
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
      transitionFunc = 'all .7s cubic-bezier(0, 0, 0, 1)',
      className,
      children
    } = this.props

    const swipeRowStyle = {
      position: 'relative',
      left: this.state.move + this.state.offset,
      transition: this.state.swiping ? '' : transitionFunc
    }

    const actionBoxStyle = {
      position: 'absolute',
      top: 0,
      right: 0,
      display: 'flex'
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
          { children && children.props.children[0] }
        </div>
        <div ref={ el => this.actionBox = el } style={actionBoxStyle}>
          { children && children.props.children.filter( el => el.type.name === 'Action') }
        </div>
      </div>
    )
  }
}

export default SwipeRow
