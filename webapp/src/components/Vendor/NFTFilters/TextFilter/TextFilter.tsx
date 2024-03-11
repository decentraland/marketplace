import { useEffect, useRef } from 'react'
import { Header } from 'decentraland-ui'

import { useInput } from '../../../../lib/input'
import { Props } from './TextFilter.types'
import './TextFilter.css'

const TextFilter = (props: Props) => {
  const { name, value, placeholder, onChange } = props

  const [text, setText] = useInput(value, onChange)
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  return (
    <div className="TextFilter Filter">
      {name ? (
        <Header sub className="name">
          {name}
        </Header>
      ) : null}
      <div className="text-input">
        <input ref={inputRef} value={text} onChange={setText} placeholder={placeholder} />
      </div>
    </div>
  )
}

export default TextFilter
