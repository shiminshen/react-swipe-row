import React, { Component } from 'react'

class SwipeAction extends Component {
  render () {
    const { children, left, right, ...props } = this.props
    return (
      <div {...props}>
        { children }
      </div>
    )
  }
}

SwipeAction.displayName = 'SwipeAction'
export default SwipeAction
