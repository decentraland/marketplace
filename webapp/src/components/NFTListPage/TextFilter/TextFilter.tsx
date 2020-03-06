import React, { useEffect, useRef } from 'react'
import { Header } from 'decentraland-ui'

import { useInput } from '../../../lib/input'
import { Props } from './TextFilter.types'
import './TextFilter.css'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'

const TextFilter = (props: Props) => {
  const { name, value, onChange } = props

  const [text, setText] = useInput(value, onChange)
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  return (
    <div className="TextFilter Filter">
      <Header sub className="name">
        {name}
      </Header>
      <div className="text-input">
        <input
          ref={inputRef}
          value={text}
          onChange={setText}
          placeholder={t('nft_list_page.search')}
        />
      </div>
    </div>
  )
}

export default TextFilter
