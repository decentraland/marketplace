import React, { useRef } from 'react'
import { Props } from './CoverElement.types'
import { Button } from 'decentraland-ui'
import './CoverElement.css'

const CoverElement = ({ title, src, onChange }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="CoverElement">
      <div className="title">{title}</div>
      <div className="image-container">
        <div className="empty"></div>
        {/* <img
          src="https://static3.srcdn.com/wordpress/wp-content/uploads/2020/06/One-Piece.jpg"
          alt="cover"
        ></img> */}
        {src && (
          <div className="buttons">
            <Button
              circular
              icon="camera"
              onClick={() => inputRef.current?.click()}
            />
            <Button circular icon="cancel" />
          </div>
        )}
      </div>
      {/* <img src={src} /> */}
      <input ref={inputRef} type="file" onChange={onChange} hidden />
    </div>
  )
}

export default React.memo(CoverElement)
