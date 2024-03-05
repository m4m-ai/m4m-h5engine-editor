import React, { Component } from 'react'
import { engineDiv } from '../../index'

export class Scene extends Component {
  render(): React.ReactNode {
    return (
      <div
        ref={element => {
          element?.appendChild(engineDiv)
        }}
      ></div>
    )
  }
}
