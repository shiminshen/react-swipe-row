import React, { Component } from 'react'
import autobind from 'react-autobind'
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
      leftActionBoxWidth: 0,
      rightActionBoxWidth: 0
    }
    autobind(this)
  }

  handleTouchStart (cb) {
    return e => {
      this.setState({
        x: (e.clientX || e.targetTouches[0].clientX),
        y: e.clientY || e.targetTouches[0].clientY,
        swiping: true
      }, () => cb && cb(this.props.rowId))
    }
  }

  handleTouchEnd (cb) {
    return e => {
      const direction = this.state.move > 0 ? 1 : 0
      const destPosition = this.state.move + this.state.offset

      console.log(direction)
      console.log(Math.abs(destPosition))
      console.log(this.state.rightActionBoxWidth / 2)
      console.log((Math.abs(destPosition) > (this.state.rightActionBoxWidth / 2)))

      const needShowRight = !direction && Math.abs(destPosition) > this.state.leftActionBoxWidth / 2
      const needShowLeft = direction && destPosition > this.state.rightActionBoxWidth / 2
      console.log(needShowLeft)
      let offset = 0
      if (direction) {
        offset = needShowLeft ? this.state.rightActionBoxWidth : 0
      } else {
        offset = needShowRight ? -this.state.leftActionBoxWidth : 0
      }

      this.setState({
        x: 0,
        y: 0,
        swiping: false,
        offset: offset,
        move: 0
      }, () => cb && cb(this.props.rowId))
    }
  }

  handleTouchMove (cb) {
    return e => {
      console.log(this.state)
      this.setState({
        move: (e.clientX || e.targetTouches[0].clientX) - this.state.x
      }, () => cb && cb(this.props.rowId))
    }
  }

  componentDidMount () {
    this.setState({
      leftActionBoxWidth: this.leftActionBox.getBoundingClientRect().width,
      rightActionBoxWidth: this.rightActionBox.getBoundingClientRect().width
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

    const rightActionBoxStyle = {
      position: 'absolute',
      top: 0,
      left: 0,
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
          { children && children[0] }
        </div>
        <div ref={el => this.leftActionBox = el} style={actionBoxStyle}>
          { children && children.filter(el => el.type.name === 'Action' && el.props.left) }
        </div>
        <div ref={el => this.rightActionBox = el} style={rightActionBoxStyle}>
          { children && children.filter(el => el.type.name === 'Action' && el.props.right) }
        </div>
      </div>
    )
  }
}

export default SwipeRow
