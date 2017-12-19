import React, { Component } from 'react'
import PropTypes from 'prop-types'
import autobind from 'react-autobind'

import Swipeable from 'react-swipeable'

class SwipeRow extends Component {
  constructor (props) {
    super(props)

    this.leftActionBoxWidth = 0
    this.rightActionBoxWidth = 0
    this.state = {
      move: 0,
      offset: 0,
      swiping: false,
      transitoin: false,
      leftActionBoxVisibility: false,
      rightActionBoxVisibility: false
    }
    autobind(this)
  }

  componentDidMount () {
    this.leftActionBoxWidth = this.leftActionBox ? this.leftActionBox.getBoundingClientRect().width : 0
    this.rightActionBoxWidth = this.rightActionBox ? this.rightActionBox.getBoundingClientRect().width : 0
  }

  swiped (e, deltaX, deltaY, isFlick, velocity) {
    let offset = this.state.offset
    const { disableSwipeLeft, disableSwipeRight } = this.props
    const direction = deltaX < 0
    const destPosition = -deltaX + offset

    if (!deltaX) { return }

    if (isFlick) {
      if (direction) {
        // swipe right
        offset = offset < 0 || disableSwipeRight ? 0 : this.leftActionBoxWidth
      } else {
        // swipe left
        offset = offset > 0 || disableSwipeLeft ? 0 : -this.rightActionBoxWidth
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
      move: 0,
      offset,
      swiping: false,
      transition: true
    })
  }

  swipingLeft (e, absX) {
    e.preventDefault()
    let move = -absX
    let offset = this.state.offset
    const destPosition = move + offset
    if (this.props.disableSwipeLeft) {
      move = (destPosition < 0) ? 0 : move
      offset = (destPosition < 0) ? 0 : offset
    }
    this.setState({
      move,
      offset,
      transition: false,
      leftActionBoxVisibility: destPosition > 0,
      rightActionBoxVisibility: destPosition < 0
    })
  }

  swipingRight (e, absX) {
    e.preventDefault()
    let move = absX
    let offset = this.state.offset
    const destPosition = move + offset
    if (this.props.disableSwipeRight) {
      move = (destPosition > 0) ? 0 : move
      offset = (destPosition > 0) ? 0 : offset
    }
    this.setState({
      move,
      offset,
      transition: false,
      leftActionBoxVisibility: destPosition > 0,
      rightActionBoxVisibility: destPosition < 0
    })
  }

  wrapParallaxActions (actionElements, align, destPosition, width, transition) {
    return actionElements && actionElements.map((el, idx) => (
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
      leftButtons,
      rightButtons,
      transitionFunc,
      disableParallax,
      className,
      children
    } = this.props

    const { move, offset, transition, leftActionBoxVisibility, rightActionBoxVisibility } = this.state

    const transitionStyle = this.state.swiping && !transition ? '' : transitionFunc

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
        >
          <Swipeable
            onSwiped={this.swiped}
            onSwipingLeft={this.swipingLeft}
            onSwipingRight={this.swipingRight}
          >
            { children }
          </Swipeable>
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
          {
            disableParallax
            ? leftButtons
            : this.wrapParallaxActions(leftButtons, 'right', offset + move, this.leftActionBoxWidth, transitionStyle)
          }
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
          {
            disableParallax
            ? rightButtons
            : this.wrapParallaxActions(rightButtons, 'left', offset + move, this.rightActionBoxWidth, transitionStyle)
          }
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
  disableSwipeRight: PropTypes.bool,
  disableParallax: PropTypes.bool
}

SwipeRow.defaultProps = {
  transitionFunc: 'all .4s cubic-bezier(0, 0, 0, 1)',
  disableSwipeLeft: false,
  disableSwipeRight: false,
  disableParallax: false
}

export default SwipeRow
