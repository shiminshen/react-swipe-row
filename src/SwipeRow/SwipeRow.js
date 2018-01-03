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
      swiping: 0, // 0 means undefined swiping direction, 1 means horizental swiping and -1 means vertical swiping
      move: 0,
      offset: 0,
      transition: false,
      leftActionBoxVisibility: false,
      rightActionBoxVisibility: false
    }
    autobind(this)
  }

  componentDidMount () {
    this.leftActionBoxWidth = this.leftActionBox ? this.leftActionBox.getBoundingClientRect().width : 0
    this.rightActionBoxWidth = this.rightActionBox ? this.rightActionBox.getBoundingClientRect().width : 0
  }

  getPosition (e) {
    return {
      x: e.clientX || e.targetTouches[0].clientX,
      y: e.clientY || e.targetTouches[0].clientY
    }
  }

  calculateMovingDistance (e) {
    const { x, y } = this.getPosition(e)
    const deltaX = x - this.state.x
    const deltaY = y - this.state.y
    return {
      deltaX,
      deltaY,
      absX: Math.abs(deltaX),
      absY: Math.abs(deltaY)
    }
  }

  handleTouchStart (cb) {
    return e => {
      const { x, y } = this.getPosition(e)
      this.setState({
        x,
        y,
        startTime: Date.now()
      }, () => cb && cb(this.props.rowId))
    }
  }

  handleTouchEnd (cb) {
    return e => {
      const { move, startTime, offset } = this.state
      const { disableSwipeLeft, disableSwipeRight } = this.props

      const destPosition = move + offset
      const duration = Date.now() - startTime

      let newOffset = offset

      if (move > 0) {
        // if swipe right
        if (duration < 200) {
          // if it is a flick swipe
          newOffset = offset < 0 ? 0 : this.leftActionBoxWidth
        } else {
          if ((destPosition > -this.rightActionBoxWidth / 2)) {
            // check whether the right action box needs to be closed
            newOffset = 0
          }
          if ((destPosition > this.leftActionBoxWidth / 2) && !disableSwipeRight) {
            // check whether the left action box need to be open
            newOffset = this.leftActionBoxWidth
          }
        }
      } else if (move < 0) {
        // if swipe left

        if (duration < 200) {
          // if it is a flick swipe
          newOffset = offset > 0 ? 0 : -this.rightActionBoxWidth
        } else {
          if (destPosition < this.leftActionBoxWidth / 2) {
            // check whether the left action box needs to be closed
            newOffset = 0
          }
          if ((destPosition < -this.rightActionBoxWidth / 2) && !disableSwipeLeft) {
            // check whether the right action box need to be open
            newOffset = -this.rightActionBoxWidth
          }
        }
      }

      this.setState({
        swiping: 0,
        move: 0,
        offset: newOffset,
        transition: true
      }, () => cb && cb(this.props.rowId))
    }
  }

  handleTouchMove (cb) {
    return e => {
      const { delta, disableSwipeLeft, disableSwipeRight } = this.props
      const { deltaX, absX, absY } = this.calculateMovingDistance(e)

      let swiping = this.state.swiping
      if (absX < delta && absY < delta && !swiping) { return }

      // defined swiping when first crossed delta threshold
      if (!swiping) {
        swiping = absX > absY ? 1 : -1
      }

      if (swiping > 0) {
        // if this swiping is defined as a horzental swiping, update the state of SwipeRow

        // prevent default behavior
        if (e.cancelable) {
          if (!e.defaultPrevented) {
            e.preventDefault()
          }
        }

        let move = deltaX
        let offset = this.state.offset
        const destPosition = move + offset
        if (disableSwipeRight) {
          if (destPosition >= 0) {
            move = 0
            offset = 0
          }
        }
        if (disableSwipeLeft) {
          if (destPosition <= 0) {
            move = 0
            offset = 0
          }
        }

        this.setState({
          swiping,
          move,
          offset,
          transition: false,
          leftActionBoxVisibility: destPosition > 0,
          rightActionBoxVisibility: destPosition < 0
        }, () => cb && cb(this.props.rowId))
      } else {
        // if this swiping is defined as a vertical swiping, ignore horizental swiping change
        this.setState({
          swiping
        })
      }
    }
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
      onTouchStart,
      onTouchEnd,
      onTouchMove,
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
          onTouchStart={this.handleTouchStart(onTouchStart)}
          onTouchEnd={this.handleTouchEnd(onTouchEnd)}
          onTouchMove={this.handleTouchMove(onTouchMove)}
          onTransitionEnd={() => this.setState({ transition: false, leftActionBoxVisibility, rightActionBoxVisibility })}
        >
          { children }
        </div>
        <div
          className='sr-left-buttons'
          ref={el => { this.leftActionBox = el }}
          style={{
            visibility: leftActionBoxVisibility ? 'visible' : 'hidden',
            position: 'absolute',
            top: 0,
            left: disableParallax ? 0 : Math.min(0, -this.leftActionBoxWidth + (offset + move)),
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
          className='sr-right-buttons'
          ref={el => { this.rightActionBox = el }}
          style={{
            visibility: rightActionBoxVisibility ? 'visible' : 'hidden',
            position: 'absolute',
            top: 0,
            right: disableParallax ? 0 : Math.min(0, -this.rightActionBoxWidth - (offset + move)),
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
  onTouchStart: PropTypes.func,
  onTouchMove: PropTypes.func,
  onTouchEnd: PropTypes.func,
  className: PropTypes.string,
  delta: PropTypes.number,
  transitionFunc: PropTypes.string,
  disableSwipeLeft: PropTypes.bool,
  disableSwipeRight: PropTypes.bool,
  disableParallax: PropTypes.bool
}

SwipeRow.defaultProps = {
  delta: 10,
  transitionFunc: 'all .3s cubic-bezier(0, 0, 0, 1)',
  disableSwipeLeft: false,
  disableSwipeRight: false,
  disableParallax: false
}

export default SwipeRow
