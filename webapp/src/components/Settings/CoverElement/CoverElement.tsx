import React from 'react'
import { Props } from './CoverElement.types'
import { Button } from 'decentraland-ui'
import './CoverElement.css'

const CoverElement = ({ title, onChange }: Props) => {
  return (
    <div className="CoverElement">
      <div className="title">{title}</div>
      <div className="image-container">
        <img
          className="image"
          src="https://static3.srcdn.com/wordpress/wp-content/uploads/2020/06/One-Piece.jpg"
        ></img>
        <div className="buttons">
          <Button className="button" circular icon="camera" />
          <Button className="button" circular icon="cancel" />
        </div>
      </div>
      {/* <img src={src} /> */}
      <input type="file" onChange={onChange} hidden />
    </div>
  )
}

export default React.memo(CoverElement)
