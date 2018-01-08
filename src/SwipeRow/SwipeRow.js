import React, { Component } from 'react'
import PropTypes from 'prop-types'
import autobind from 'react-autobind'

class SwipeRow extends Component {
  constructor (props) {
    super(props)

    this.state = {
      x: 0,
      y: 0,
      startTime: null,
      swiping: 0, // 0 means undefined swiping direction, 1 means horizental swiping and -1 means vertical swiping
      move: 0,
      offset: 0,
      actionTrigger: 0,
      transition: false,
      contentBoxWidth: 0,
      dynLeftActionBoxWidth: 0,
      dynRightActionBoxWidth: 0,
      leftActionBoxWidth: 0,
      leftActionBoxVisibility: false,
      rightActionBoxWidth: 0,
      rightActionBoxVisibility: false
    }
    autobind(this)
  }

  componentDidMount () {
    this.setState({
      contentBoxWidth: this.contentBox ? this.contentBox.getBoundingClientRect().width : 0,
      leftActionBoxWidth: this.leftActionBox ? this.leftActionBox.getBoundingClientRect().width : 0,
      rightActionBoxWidth: this.rightActionBox ? this.rightActionBox.getBoundingClientRect().width : 0
    })
  }

  componentDidUpdate (prevProps, prevState) {
    let dynLeftActionBoxWidth = this.leftActionBox ? this.leftActionBox.getBoundingClientRect().width : 0
    let dynRightActionBoxWidth = this.rightActionBox ? this.rightActionBox.getBoundingClientRect().width : 0

    if (dynLeftActionBoxWidth !== prevState.dynLeftActionBoxWidth || dynRightActionBoxWidth !== prevState.dynRightActionBoxWidth) {
      this.setState({
        dynLeftActionBoxWidth,
        dynRightActionBoxWidth
      })
    }
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
        actionTrigger: 0,
        startTime: Date.now()
      }, () => cb && cb(this.props.rowId))
    }
  }

  handleTouchEnd (cb) {
    return e => {
      const { move, startTime, offset, leftActionBoxWidth, rightActionBoxWidth } = this.state
      const { switchThreshold, flickThreshold, disableSwipeLeft, disableSwipeRight } = this.props

      const contentPosition = move + offset
      const duration = Date.now() - startTime

      let newOffset = offset

      if (move > 0) {
        // if swipe right
        if (duration < flickThreshold) {
          // if it is a flick swipe
          newOffset = offset < 0 ? 0 : leftActionBoxWidth
        } else {
          if ((contentPosition > -rightActionBoxWidth * switchThreshold)) {
            // check whether the right action box needs to be closed
            newOffset = 0
          }
          if ((contentPosition > leftActionBoxWidth * switchThreshold) && !disableSwipeRight) {
            // check whether the left action box need to be open
            newOffset = leftActionBoxWidth
          }
        }
      } else if (move < 0) {
        // if swipe left
        if (duration < flickThreshold) {
          // if it is a flick swipe
          newOffset = offset > 0 ? 0 : -rightActionBoxWidth
        } else {
          if (contentPosition < leftActionBoxWidth * switchThreshold) {
            // check whether the left action box needs to be closed
            newOffset = 0
          }
          if ((contentPosition < -rightActionBoxWidth * switchThreshold) && !disableSwipeLeft) {
            // check whether the right action box need to be open
            newOffset = -rightActionBoxWidth
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
      const { deltaThreshold, disableSwipeLeft, disableSwipeRight } = this.props
      const { deltaX, absX, absY } = this.calculateMovingDistance(e)

      let swiping = this.state.swiping
      if (absX < deltaThreshold && absY < deltaThreshold && !swiping) { return }

      // defined swiping when first crossed delta threshold
      if (!swiping) {
        swiping = absX > absY ? 1 : -1
      }

      if (swiping > 0) {
        // if this swiping is defined as a horzental swiping, prevent default behavior
        // and update the state of SwipeRow
        if (e.cancelable) {
          if (!e.defaultPrevented) {
            e.preventDefault()
          }
        }

        let move = deltaX
        let offset = this.state.offset
        const contentPosition = move + offset

        // check disable direction
        if (disableSwipeRight) {
          if (contentPosition >= 0) {
            move = 0
            offset = 0
          }
        }
        if (disableSwipeLeft) {
          if (contentPosition <= 0) {
            move = 0
            offset = 0
          }
        }

        let actionTrigger = 0
        if (contentPosition >= this.state.contentBoxWidth / 2) {
          actionTrigger = 1
        }
        if (contentPosition <= -this.state.contentBoxWidth / 2) {
          actionTrigger = -1
        }

        this.setState({
          swiping,
          move,
          offset,
          transition: !!actionTrigger,
          actionTrigger,
          leftActionBoxVisibility: contentPosition > 0,
          rightActionBoxVisibility: contentPosition < 0
        }, () => cb && cb(this.props.rowId))
      } else {
        // if this swiping is defined as a vertical swiping, ignore horizental swiping change
        this.setState({
          swiping
        })
      }
    }
  }

  wrapParallaxActions (actionElements, align, destPosition, width, transition, actionTrigger) {
    return actionElements && actionElements.map((el, idx, arr) => (
      <div
        key={idx}
        style={{
          position: 'relative',
          transition,
          flexGrow: 1,
          width: actionTrigger && idx === arr.length - 1 ? this.state.dynLeftActionBoxWidth : 'auto',
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

    const {
      move,
      offset,
      swiping,
      transition,
      actionTrigger,
      leftActionBoxWidth,
      leftActionBoxVisibility,
      rightActionBoxWidth,
      rightActionBoxVisibility
    } = this.state

    const transitionStyle = swiping && !transition ? '' : transitionFunc
    return (
      <div className={className} style={{ position: 'relative', overflow: 'hidden' }}>
        <div
          className='sr-content'
          ref={el => { this.contentBox = el }}
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
            left: disableParallax ? 0 : Math.min(0, -leftActionBoxWidth + (offset + move)),
            width: leftActionBoxWidth ? Math.max(leftActionBoxWidth, (offset + move)) : 'auto',
            display: 'flex',
            flexDirection: 'row-reverse',
            transition: transitionStyle
          }}
        >
          {
            disableParallax
            ? leftButtons
            : this.wrapParallaxActions(leftButtons, 'right', offset + move, leftActionBoxWidth, transitionStyle, actionTrigger)
          }
        </div>
        <div
          className='sr-right-buttons'
          ref={el => { this.rightActionBox = el }}
          style={{
            visibility: rightActionBoxVisibility ? 'visible' : 'hidden',
            position: 'absolute',
            top: 0,
            right: disableParallax ? 0 : Math.min(0, -rightActionBoxWidth - (offset + move)),
            width: leftActionBoxWidth ? Math.max(rightActionBoxWidth, -(offset + move)) : 'auto',
            display: 'flex',
            transition: transitionStyle
          }}
        >
          {
            disableParallax
            ? rightButtons
            : this.wrapParallaxActions(rightButtons, 'left', offset + move, rightActionBoxWidth, transitionStyle, actionTrigger)
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
  leftButtons: PropTypes.array,
  rightButtons: PropTypes.array,
  switchThreshold: PropTypes.number,
  deltaThreshold: PropTypes.number,
  flickThreshold: PropTypes.number,
  transitionFunc: PropTypes.string,
  disableSwipeLeft: PropTypes.bool,
  disableSwipeRight: PropTypes.bool,
  disableParallax: PropTypes.bool
}

SwipeRow.defaultProps = {
  leftButtons: [],
  rightButtons: [],
  switchThreshold: 0.5,
  deltaThreshold: 10,
  flickThreshold: 200,
  transitionFunc: 'all 2s cubic-bezier(0, 0, 0, 1)',
  disableSwipeLeft: false,
  disableSwipeRight: false,
  disableParallax: false
}

export default SwipeRow
