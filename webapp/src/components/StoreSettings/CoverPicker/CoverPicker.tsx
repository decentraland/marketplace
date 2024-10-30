import React, { useCallback, useRef } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Button, Empty } from 'decentraland-ui'
import { Props } from './CoverPicker.types'
import './CoverPicker.css'

const readFile = (file: File): Promise<string> => {
  const reader = new FileReader()
  return new Promise<string>((resolve, reject) => {
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

const CoverPicker = ({ src, onChange }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleOnFileChange = useCallback(
    async (e: Parameters<React.ChangeEventHandler<HTMLInputElement>>[0]) => {
      const file = e.target.files?.[0]
      if (file) {
        const src = await readFile(file)
        const reader = new FileReader()
        reader.readAsDataURL(file)
        onChange(src, file.name, file.size)
      } else {
        onChange()
      }
    },
    [onChange]
  )

  return (
    <div className="CoverPicker">
      <div className="image-container">
        {src ? (
          <img src={src} alt="cover"></img>
        ) : (
          <Empty>
            <div className="cover-image-container">
              <div className="watermelon" />
              <button className="add-cover" onClick={() => inputRef.current?.click()}>
                {t('store_settings.add_cover_picture')}
              </button>
            </div>
          </Empty>
        )}
        {src && (
          <div className="buttons">
            <Button circular icon="camera" onClick={() => inputRef.current?.click()} />
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
      <input ref={inputRef} type="file" accept="image/*" onChange={handleOnFileChange} hidden />
    </div>
  )
}

export default React.memo(CoverPicker)
