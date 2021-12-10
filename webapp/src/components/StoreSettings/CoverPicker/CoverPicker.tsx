import React, { useRef } from 'react'
import { Props } from './CoverPicker.types'
import { Button, Center, Empty } from 'decentraland-ui'
import './CoverPicker.css'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'

const CoverPicker = ({ src, onChange }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="CoverPicker">
      <div className="image-container">
        {src ? (
          <img src={src} alt="cover"></img>
        ) : (
          <Empty>
            <Center>
              <div className="watermelon" />
              <button
                className="add-cover"
                onClick={e => {
                  e.stopPropagation()
                  inputRef.current?.click()
                }}
              >
                {t('store_settings.add_cover_picture')}
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
            const src = URL.createObjectURL(file)
            onChange({ src, file })
          } else {
            onChange()
          }
        }}
        hidden
      />
    </div>
  )
}

export default React.memo(CoverPicker)
