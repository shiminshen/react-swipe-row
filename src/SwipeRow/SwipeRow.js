import React, { Component } from 'react'
import PropTypes from 'prop-types'
import autobind from 'react-autobind'

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
      transitoin: false,
      move: 0,
      offset: 0,
      leftActionBoxVisibility: false,
      rightActionBoxVisibility: false
    }
    autobind(this)
  }

  componentDidMount () {
    this.leftActionBoxWidth = this.leftActionBox ? this.leftActionBox.getBoundingClientRect().width : 0
    this.rightActionBoxWidth = this.rightActionBox ? this.rightActionBox.getBoundingClientRect().width : 0
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
      const { move, startTime } = this.state
      let { offset } = this.state
      const { disableSwipeLeft, disableSwipeRight } = this.props

      const direction = move > 0
      const destPosition = move + offset
      const duration = Date.now() - startTime

      if (!move) { return }

      if (duration < 200) {
        if (direction) {
          // swipe right
          offset = offset < 0 ? 0 : this.leftActionBoxWidth
        } else {
          // swipe left
          offset = offset > 0 ? 0 : -this.rightActionBoxWidth
        }
      } else {
        if (direction) {
          // if swipe right
          // check whether the right action box needs to be closed
          offset = (destPosition > -this.rightActionBoxWidth / 2) ? 0 : offset
          // chekc whether the left action box need to be open
          offset = (destPosition > this.leftActionBoxWidth / 2) && !disableSwipeRight ? this.leftActionBoxWidth : offset
        } else {
          // if swipe left
          // check whether the left action box needs to be closed
          offset = (destPosition < this.leftActionBoxWidth / 2) ? 0 : offset
          // chekc whether the right action box need to be open
          offset = (destPosition < -this.rightActionBoxWidth / 2) && !disableSwipeLeft ? -this.rightActionBoxWidth : offset
        }
      }

      this.setState({
        x: 0,
        y: 0,
        swiping: false,
        transition: true,
        offset,
        move: 0
      }, () => cb && cb(this.props.rowId))
    }
  }

  handleTouchMove (cb) {
    return e => {
      const { disableSwipeLeft, disableSwipeRight } = this.props
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
        offset,
        transition: false,
        leftActionBoxVisibility: destPosition > 0,
        rightActionBoxVisibility: destPosition < 0
      }, () => cb && cb(this.props.rowId))
    }
  }

  wrapParallaxActions (actionElements, align, destPosition, width, transition) {
    return actionElements.map((el, idx) => (
      <div
        key={idx}
        style={{
          position: 'relative',
          transition,
          left: align === 'left'
            ? Math.min(0, -(width / actionElements.length) * idx - destPosition * (1 / actionElements.length * idx))
            : Math.max(0, (width / actionElements.length) * idx - destPosition * (1 / actionElements.length * idx))
        }}
      >
        {el}
      </div>
    ))
  }

  render () {
    const {
      touchStartCallback,
      touchEndCallback,
      touchMoveCallback,
      transitionFunc,
      className,
      children
    } = this.props

    const { move, offset, transition, leftActionBoxVisibility, rightActionBoxVisibility } = this.state

    const transitionStyle = this.state.swiping && !transition ? '' : transitionFunc

    const leftActionBox = children && children.filter(el => el.type.displayName === 'SwipeAction' && el.props.left)
    const rightActionBox = children && children.filter(el => el.type.displayName === 'SwipeAction' && el.props.right)

    return (
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <div
          className={className}
          style={{
            position: 'relative',
            left: move + offset,
            zIndex: 2,
            transition: transitionStyle
          }}
          onTransitionEnd={() => this.setState({ transition: false, leftActionBoxVisibility, rightActionBoxVisibility })}
          onTouchStart={this.handleTouchStart(touchStartCallback)}
          onTouchEnd={this.handleTouchEnd(touchEndCallback)}
          onTouchMove={this.handleTouchMove(touchMoveCallback)}
        >
          { children && children.filter(el => !el.props.left && !el.props.right) }
        </div>
        <div
          ref={el => { this.leftActionBox = el }}
          style={{
            visibility: leftActionBoxVisibility ? 'visible' : 'hidden',
            position: 'absolute',
            top: 0,
            left: Math.min(0, -this.leftActionBoxWidth + (offset + move)),
            display: 'flex',
            flexDirection: 'row-reverse',
            transition: transitionStyle
          }}
        >
          { this.wrapParallaxActions(leftActionBox, 'right', offset + move, this.leftActionBoxWidth, transitionStyle) }
        </div>
        <div
          ref={el => { this.rightActionBox = el }}
          style={{
            visibility: rightActionBoxVisibility ? 'visible' : 'hidden',
            position: 'absolute',
            top: 0,
            right: Math.min(0, -this.rightActionBoxWidth - (offset + move)),
            display: 'flex',
            transition: transitionStyle
          }}
        >
          { this.wrapParallaxActions(rightActionBox, 'left', offset + move, this.rightActionBoxWidth, transitionStyle) }
        </div>
      </div>
    )
  }
}

SwipeRow.propTypes = {
  touchStartCallback: PropTypes.func,
  touchMoveCallback: PropTypes.func,
  touchEndCallback: PropTypes.func,
  className: PropTypes.string,
  transitionFunc: PropTypes.string,
  disableSwipeLeft: PropTypes.bool,
  disableSwipeRight: PropTypes.bool
}

SwipeRow.defaultProps = {
  transitionFunc: 'all .7s cubic-bezier(0, 0, 0, 1)',
  disableSwipeLeft: false,
  disableSwipeRight: false
}

export default SwipeRow
