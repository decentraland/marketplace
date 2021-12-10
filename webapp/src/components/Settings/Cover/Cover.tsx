import React, { useRef } from 'react'
import { Props } from './Cover.types'
import { Button, Center, Empty } from 'decentraland-ui'
import './Cover.css'

const Cover = ({ src, onChange }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="Cover">
      <div className="image-container">
        {src ? (
          <img src={src} alt="cover"></img>
        ) : (
          <Empty>
            <Center>
              <button
                className="add-cover"
                onClick={e => {
                  e.stopPropagation()
                  inputRef.current?.click()
                }}
              >
                Click here to add a cover picture
              </button>
            </Center>
          </Empty>
        )}
        {src && (
          <div className="buttons">
            <Button
              circular
              icon="camera"
              onClick={() => inputRef.current?.click()}
            />
            <Button
              circular
              icon="cancel"
              onClick={() => {
                if (inputRef.current) {
                  inputRef.current.value = ''
                }
                onChange()
              }}
            />
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        onChange={async e => {
          const file = e.target.files?.[0]

          if (file) {
            const newSrc = URL.createObjectURL(file)
            onChange(newSrc)
          } else {
            onChange()
          }
        }}
        hidden
      />
    </div>
  )
}

export default React.memo(Cover)
