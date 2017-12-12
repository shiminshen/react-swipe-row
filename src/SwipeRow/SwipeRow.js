import React, { Component } from 'react'
import autobind from 'react-autobind'
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css'

class SwipeRow extends Component {
  constructor (props) {
    super(props)

    this.leftActionBoxWidth = 0
    this.rightActionBoxWidth = 0
    this.state = {
      x: 0,
      y: 0,
      startTime: null,
      swiping: false,
      move: 0,
      offset: 0
    }
    autobind(this)
  }

  handleTouchStart (cb) {
    return e => {
      this.setState({
        x: (e.clientX || e.targetTouches[0].clientX),
        y: e.clientY || e.targetTouches[0].clientY,
        startTime: Date.now(),
        swiping: true
      }, () => cb && cb(this.props.rowId))
    }
  }

  handleTouchEnd (cb) {
    return e => {
      const direction = this.state.move > 0
      const destPosition = this.state.move + this.state.offset
      const duration = Date.now() - this.state.startTime

      let offset = 0
      if (direction) {
        const needShowLeft = direction && ((destPosition > this.leftActionBoxWidth / 2) || (duration < 200 && this.state.offset === 0))
        offset = needShowLeft ? this.leftActionBoxWidth : 0
      } else {
        const needShowRight = !direction && ((Math.abs(destPosition) > this.rightActionBoxWidth / 2) || (duration < 200 && this.state.offset === 0))
        offset = needShowRight ? -this.rightActionBoxWidth : 0
      }

      this.setState({
        x: 0,
        y: 0,
        swiping: false,
        offset,
        move: 0
      }, () => cb && cb(this.props.rowId))
    }
  }

  handleTouchMove (cb) {
    return e => {
      const { disableSwipeLeft = false, disableSwipeRight = false } = this.props
      let move = (e.clientX || e.targetTouches[0].clientX) - this.state.x
      let offset = this.state.offset
      const destPosition = move + offset

      if (disableSwipeRight) {
        move = (destPosition >= 0) ? 0 : move
        offset = (destPosition >= 0) ? 0 : offset
      }
      if (disableSwipeLeft) {
        move = (destPosition <= 0) ? 0 : move
        offset = (destPosition <= 0) ? 0 : offset
      }

      this.setState({
        move,
        offset
      }, () => cb && cb(this.props.rowId))
    }
  }

  componentDidMount () {
    this.leftActionBoxWidth = this.leftActionBox ? this.leftActionBox.getBoundingClientRect().width : 0
    this.rightActionBoxWidth = this.rightActionBox ? this.rightActionBox.getBoundingClientRect().width : 0
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
          { children && children.filter(el => !el.props.left && !el.props.right) }
        </div>
        <div ref={el => { this.leftActionBox = el }} style={{ position: 'absolute', top: 0, left: 0, display: 'flex' }}>
          { children && children.filter(el => el.props.left) }
        </div>
        <div ref={el => { this.rightActionBox = el }} style={{ position: 'absolute', top: 0, right: 0, display: 'flex' }}>
          { children && children.filter(el => el.props.right) }
        </div>
      </div>
    )
  }
}

export default SwipeRow
