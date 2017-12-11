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
    this.setState({
      x: 0,
      y: 0,
      swiping: false,
      offset: this.state.move > 0 ? 0 : -this.state.actionBoxWidth,
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
        <div ref={ el => this.actionBox = el } className='actionBox' style={actionBoxStyle}>
          { children && children.props.children.filter( (el, idx) => idx !== 0) }
        </div>
      </div>
    )
  }
}

export default SwipeRow
