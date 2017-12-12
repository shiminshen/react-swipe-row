import React, { Component } from 'react'
import autobind from 'react-autobind'
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css'

import './SwipeRow.css'

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
      offset: 0,
      disableSwipeLeft: props.disableSwipeLeft || false,
      disableSwipeRight: props.disableSwipeRight || false
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
      const { move, startTime, disableSwipeLeft, disableSwipeRight } = this.state
      let { offset } = this.state

      const direction = move > 0
      const destPosition = move + offset
      const duration = Date.now() - startTime

      if (!move) { return }

      if (direction) {
        // check whether the right action box needs to be closed
        offset = (destPosition > -this.rightActionBoxWidth / 2) ? 0 : offset
        // chekc whether the left action box need to be open
        offset = (destPosition > this.leftActionBoxWidth / 2) && !disableSwipeLeft ? this.leftActionBoxWidth : offset
      }
      if (!direction) {
        // check whether the left action box needs to be closed
        offset = (destPosition < this.leftActionBoxWidth / 2) ? 0 : offset
        // chekc whether the right action box need to be open
        offset = (destPosition < -this.rightActionBoxWidth / 2) && !disableSwipeRight ? -this.rightActionBoxWidth : offset
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
      const { x, disableSwipeLeft, disableSwipeRight } = this.state
      let move = (e.clientX || e.targetTouches[0].clientX) - x
      let offset = this.state.offset
      const destPosition = move + offset

      if (disableSwipeLeft) {
        move = (destPosition >= 0) ? 0 : move
        offset = (destPosition >= 0) ? 0 : offset
      }
      if (disableSwipeRight) {
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
          className={className || 'swipeRowContent'}
          style={swipeRowStyle}
          onTouchStart={this.handleTouchStart(touchStartCallback)}
          onTouchEnd={this.handleTouchEnd(touchEndCallback)}
          onTouchMove={this.handleTouchMove(touchMoveCallback)}
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
