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
      transition: false,
      leftActionBoxWidth: 0,
      leftActionBoxVisibility: false,
      rightActionBoxWidth: 0,
      rightActionBoxVisibility: false
    }
    autobind(this)
  }

  componentDidMount () {
    this.setState({
      leftActionBoxWidth: this.leftActionBox ? this.leftActionBox.getBoundingClientRect().width : 0,
      rightActionBoxWidth: this.rightActionBox ? this.rightActionBox.getBoundingClientRect().width : 0
    })
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

        this.setState({
          swiping,
          move,
          offset,
          transition: false,
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

  wrapParallaxActions (actionElements, align, contentPosition, width, transition) {
    return actionElements && actionElements.map((el, idx) => (
      <div
        key={idx}
        style={{
          position: 'relative',
          flexGrow: 1,
          transition,
          left: align === 'left'
            ? Math.min(0, -(width / actionElements.length) * idx - contentPosition * (1 / actionElements.length * idx))
            : Math.max(0, (width / actionElements.length) * idx - contentPosition * (1 / actionElements.length * idx))
        }}
      >
        {el}
      </div>
    ))
  }

  render () {
    const {
      props: {
        onTouchStart,
        onTouchEnd,
        onTouchMove,
        leftButtons,
        rightButtons,
        transitionFunc,
        disableParallax,
        className,
        children
      },
      state: {
        move,
        offset,
        transition,
        leftActionBoxWidth,
        rightActionBoxWidth,
        leftActionBoxVisibility,
        rightActionBoxVisibility
      }
    } = this

    const transitionStyle = this.state.swiping && !transition ? '' : transitionFunc
    const contentPosition = move + offset

    return (
      <div className={className} style={{ position: 'relative', overflow: 'hidden' }}>
        <div
          className='sr-content'
          style={{
            position: 'relative',
            left: contentPosition,
            zIndex: 2,
            transition: transitionStyle
          }}
          onTouchStart={this.handleTouchStart(onTouchStart)}
          onTouchEnd={this.handleTouchEnd(onTouchEnd)}
          onTouchMove={this.handleTouchMove(onTouchMove)}
          onTransitionEnd={() => this.setState({
            transition: false,
            leftActionBoxVisibility: offset > 0,
            rightActionBoxVisibility: offset < 0
          })}
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
            left: disableParallax ? 0 : Math.min(0, -leftActionBoxWidth + contentPosition),
            width: disableParallax ? 'auto' : Math.max(leftActionBoxWidth, contentPosition) || 'auto',
            display: 'flex',
            flexDirection: 'row-reverse',
            transition: transitionStyle
          }}
        >
          {
            disableParallax
            ? leftButtons
            : this.wrapParallaxActions(leftButtons, 'right', contentPosition, leftActionBoxWidth, transitionStyle)
          }
        </div>
        <div
          className='sr-right-buttons'
          ref={el => { this.rightActionBox = el }}
          style={{
            visibility: rightActionBoxVisibility ? 'visible' : 'hidden',
            position: 'absolute',
            top: 0,
            right: disableParallax ? 0 : Math.min(0, -rightActionBoxWidth - contentPosition),
            width: disableParallax ? 'auto' : Math.max(rightActionBoxWidth, -contentPosition) || 'auto',
            display: 'flex',
            transition: transitionStyle
          }}
        >
          {
            disableParallax
            ? rightButtons
            : this.wrapParallaxActions(rightButtons, 'left', contentPosition, rightActionBoxWidth, transitionStyle)
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
  /**
   * Class name to customize style of wrapper component
   */
  className: PropTypes.string,
  /**
   * React components at the left side
   */
  leftButtons: PropTypes.array,
  /**
   * React components at the right side
   */
  rightButtons: PropTypes.array,
  /**
   * The propotion of left and right buttons' width  to trigger those buttons to switch
   */
  switchThreshold: PropTypes.number,
  /**
   * The moving distance to determine this swipe is vertical or horizontal
   */
  deltaThreshold: PropTypes.number,
  /**
   * The duration time to determine the swipe is flick or not
   */
  flickThreshold: PropTypes.number,
  /**
   * The transition function of touch end animation
   */
  transitionFunc: PropTypes.string,
  /**
   * Disable content to swipe left
   */
  disableSwipeLeft: PropTypes.bool,
  /**
   * Disable content to swipe right
   */
  disableSwipeRight: PropTypes.bool,
  /**
   * Disable parallax when buttons swiping
   */
  disableParallax: PropTypes.bool
}

SwipeRow.defaultProps = {
  leftButtons: [],
  rightButtons: [],
  switchThreshold: 0.5,
  deltaThreshold: 10,
  flickThreshold: 200,
  transitionFunc: 'all .3s cubic-bezier(0, 0, 0, 1)',
  disableSwipeLeft: false,
  disableSwipeRight: false,
  disableParallax: false
}

export default SwipeRow
