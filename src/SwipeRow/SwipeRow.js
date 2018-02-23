import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class SwipeRow extends Component {
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
    this.handleTouchStart = this.handleTouchStart.bind(this)
    this.handleTouchMove = this.handleTouchMove.bind(this)
    this.handleTouchEnd = this.handleTouchEnd.bind(this)
  }

  componentDidMount () {
    this.setState({
      leftActionBoxWidth: this.leftActionBox.getBoundingClientRect().width,
      rightActionBoxWidth: this.rightActionBox.getBoundingClientRect().width
    })
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.isClose !== this.props.isClose && nextProps.isClose) {
      this.doClose()
    }
  }

  doUpdateContentOffset (offset = 0) {
    this.setState({
      swiping: 0,
      move: 0,
      offset,
      transition: true
    })
  }

  doClose () {
    this.doUpdateContentOffset(0)
  }

  getPosition (e) {
    return {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
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

  handleTouchStart (e) {
    const { x, y } = this.getPosition(e)
    this.setState({
      x,
      y,
      startTime: Date.now()
    })
    this.props.onTouchStart && this.props.onTouchStart(e)
  }

  handleTouchMove (e) {
    const { deltaThreshold, disableSwipeLeft, disableSwipeRight } = this.props
    const { deltaX, absX, absY } = this.calculateMovingDistance(e)

    let swiping = this.state.swiping
    if (absX < deltaThreshold && absY < deltaThreshold && !swiping) {
      return
    }

    // defined swiping when acrossed delta threshold
    if (!swiping) {
      swiping = absX > absY ? 1 : -1
    }

    if (swiping > 0) {
      // if this swiping is defined as a horzental swiping, prevent default behavior
      // and update the state of SwipeRow
      e.preventDefault()

      let move = deltaX
      let offset = this.state.offset
      const contentPosition = move + offset

      // handle the disable swipe
      if (
        (disableSwipeRight && contentPosition >= 0) ||
        (disableSwipeLeft && contentPosition <= 0)
      ) {
        move = 0
        offset = 0
      }

      this.setState({
        swiping,
        move,
        offset,
        transition: false,
        leftActionBoxVisibility: contentPosition > 0,
        rightActionBoxVisibility: contentPosition < 0
      })
    } else {
      // if this swiping is regarded as a vertical swiping, ignore horizental swiping change
      this.setState({
        swiping
      })
    }
    this.props.onTouchMove && this.props.onTouchMove(e)
  }

  handleTouchEnd (e) {
    const {
      move,
      startTime,
      offset,
      leftActionBoxWidth,
      rightActionBoxWidth
    } = this.state
    const {
      switchThreshold,
      flickThreshold,
      disableSwipeLeft,
      disableSwipeRight
    } = this.props

    const contentPosition = move + offset
    const duration = Date.now() - startTime

    let newOffset = offset

    if (move > 0) {
      // if swipe right
      if (duration < flickThreshold) {
        // if it is a flick swipe
        newOffset = offset < 0 ? 0 : leftActionBoxWidth
      } else {
        // check whether the right action box needs to be closed
        if (contentPosition > -rightActionBoxWidth * switchThreshold) {
          // check whether the left action box need to be open
          newOffset =
            !disableSwipeRight &&
            contentPosition > leftActionBoxWidth * switchThreshold
              ? leftActionBoxWidth
              : 0
        }
      }
    } else if (move < 0) {
      // if swipe left
      if (duration < flickThreshold) {
        // if it is a flick swipe
        newOffset = offset > 0 ? 0 : -rightActionBoxWidth
      } else {
        // check whether the left action box needs to be closed
        if (contentPosition < leftActionBoxWidth * switchThreshold) {
          // check whether the right action box need to be open
          newOffset =
            !disableSwipeLeft &&
            contentPosition < -rightActionBoxWidth * switchThreshold
              ? -rightActionBoxWidth
              : 0
        }
      }
    }

    this.doUpdateContentOffset(newOffset)
    this.props.onTouchEnd && this.props.onTouchEnd(e)
  }

  wrapParallaxActions (buttons, align, contentPosition, width, transition) {
    return (
      buttons &&
      buttons.map((el, idx) => (
        <div
          key={idx}
          style={{
            position: 'relative',
            flexGrow: 1,
            transition,
            left:
              align === 'left'
                ? Math.min(
                  0,
                  -(width / buttons.length) * idx -
                      contentPosition * (1 / buttons.length * idx)
                )
                : Math.max(
                  0,
                  width / buttons.length * idx -
                      contentPosition * (1 / buttons.length * idx)
                )
          }}
        >
          {el}
        </div>
      ))
    )
  }

  render () {
    const {
      props: {
        leftButtons,
        rightButtons,
        transitionFunc,
        disableParallax,
        disableExpand,
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

    const transitionStyle =
      this.state.swiping && !transition ? '' : transitionFunc
    const contentPosition = move + offset

    return (
      <div
        className={className}
        style={{ position: 'relative', overflow: 'hidden' }}
      >
        <div
          className='sr-content'
          style={{
            position: 'relative',
            left: contentPosition,
            zIndex: 2,
            transition: transitionStyle
          }}
          onTouchStart={this.handleTouchStart}
          onTouchEnd={this.handleTouchEnd}
          onTouchMove={this.handleTouchMove}
          onTransitionEnd={() =>
            this.setState({
              transition: false,
              leftActionBoxVisibility: offset > 0,
              rightActionBoxVisibility: offset < 0
            })
          }
        >
          {children}
        </div>
        <div
          className='sr-left-buttons'
          ref={el => {
            this.leftActionBox = el
          }}
          style={{
            visibility: leftActionBoxVisibility ? 'visible' : 'hidden',
            position: 'absolute',
            top: 0,
            left: disableParallax
              ? 0
              : Math.min(0, -leftActionBoxWidth + contentPosition),
            width:
              disableParallax || disableExpand
                ? 'auto'
                : Math.max(leftActionBoxWidth, contentPosition) || 'auto',
            display: 'flex',
            flexDirection: 'row-reverse',
            transition: transitionStyle
          }}
        >
          {disableParallax
            ? leftButtons
            : this.wrapParallaxActions(
              leftButtons,
              'right',
              contentPosition,
              leftActionBoxWidth,
              transitionStyle
            )}
        </div>
        <div
          className='sr-right-buttons'
          ref={el => {
            this.rightActionBox = el
          }}
          style={{
            visibility: rightActionBoxVisibility ? 'visible' : 'hidden',
            position: 'absolute',
            top: 0,
            right: disableParallax
              ? 0
              : Math.min(0, -rightActionBoxWidth - contentPosition),
            width:
              disableParallax || disableExpand
                ? 'auto'
                : Math.max(rightActionBoxWidth, -contentPosition) || 'auto',
            display: 'flex',
            transition: transitionStyle
          }}
        >
          {disableParallax
            ? rightButtons
            : this.wrapParallaxActions(
              rightButtons,
              'left',
              contentPosition,
              rightActionBoxWidth,
              transitionStyle
            )}
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
   * React components which will be the content of the SwipeRow
   */
  children: PropTypes.node,
  /**
   * React components at the left side
   */
  leftButtons: PropTypes.array,
  /**
   * React components at the right side
   */
  rightButtons: PropTypes.array,
  /**
   * Forced SwipeRow to close if isClose is true
   */
  isClose: PropTypes.bool,
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
  disableParallax: PropTypes.bool,
  /**
   * Disable expend effect when buttons swiping
   */
  disableExpand: PropTypes.bool
}

SwipeRow.defaultProps = {
  leftButtons: [],
  rightButtons: [],
  isClose: undefined,
  switchThreshold: 0.5,
  deltaThreshold: 10,
  flickThreshold: 200,
  transitionFunc: 'all .3s cubic-bezier(0, 0, 0, 1)',
  disableSwipeLeft: false,
  disableSwipeRight: false,
  disableParallax: false,
  disableExpand: false
}
