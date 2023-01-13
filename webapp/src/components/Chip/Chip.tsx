import * as React from 'react'
import { Icon } from 'decentraland-ui'
import classNames from 'classnames'

import { Props } from './Chip.types'

import './Chip.css'

const Chip = (props: Props) => {
  const { type, text, icon, className, isActive, isDisabled, onClick } = props
  if (!text && !icon) {
    throw new Error('You need to provide at least one prop: text or icon')
  }

  const handleKeyDown = (evt: React.KeyboardEvent<HTMLDivElement>) => {
    if (evt.key === 'Enter' && onClick) {
      onClick(evt)
    }
  }

  const containerClass = classNames(
    'Chip',
    type,
    className,
    {
      active: isActive,
      disabled: isDisabled,
      clickeable: onClick && !isDisabled
    }
  )

  return (
    <div
      className={containerClass}
      tabIndex={0}
      onClick={isActive || isDisabled ? undefined : onClick}
      onKeyDown={handleKeyDown}
    >
      {text ? (
        <span className="text">{text}</span>
      ) : icon ? (
        <Icon name={icon} />
      ) : null}
    </div>
  )
}

Chip.defaultProps = {
  text: '',
  icon: '',
  type: 'square',
  isDisabled: false,
  isActive: false
}

export default React.memo(Chip)
