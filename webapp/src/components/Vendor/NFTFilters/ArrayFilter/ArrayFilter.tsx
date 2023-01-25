import { Header } from 'decentraland-ui'
import classNames from 'classnames'

import { Props } from './ArrayFilter.types'
import './ArrayFilter.css'

const getNewValues = (value: string, values: string[]) => {
  return values.some(x => x === value)
    ? values.filter(x => x !== value)
    : [...values, value]
}

const ArrayFilter = (props: Props) => {
  const { name, values, options, onChange } = props

  const handleKeyDown = (option: string) => (evt: React.KeyboardEvent<HTMLDivElement> ) => {
    if (evt.key === 'Enter') {
      onChange(getNewValues(option, values))
    }
  }

  const handleOnClick = (option: string) => () => {
    onChange(getNewValues(option, values))
  }


  return (
    <div className="ArrayFilter Filter">
      {name ? (
        <Header sub className="name">
          {name}
        </Header>
      ) : null}
      <div className="options">
        {options.map(option => {
          const isActive = values.includes(option.value)
          return (
            <div
              tabIndex={0}
              role="checkbox"
              aria-checked={isActive}
              key={option.text}
              className={classNames('option', { selected: isActive })}
              onClick={handleOnClick(option.value)}
              onKeyDown={handleKeyDown(option.value)}
            >
              {option.text}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ArrayFilter
