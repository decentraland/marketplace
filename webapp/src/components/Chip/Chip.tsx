import * as React from 'react'
import { Icon } from 'decentraland-ui'

import { Props } from './Chip.types'

import './Chip.css'

const Chip = (props: Props) => {
  const { type, text, icon, className, isActive, isDisabled, onClick } = props
  if (!text && !icon) {
    throw new Error('You need to provide at least one prop: text or icon')
  }

  const classNames = ['Chip', type]

  if (className) {
    classNames.push(className)
  }
  if (isActive) {
    classNames.push('active')
  }
  if (isDisabled) {
    classNames.push('disabled')
  }
  if (onClick && !isDisabled) {
    classNames.push('clickeable')
  }

  return (
    <div
      className={classNames.join(' ')}
      onClick={isActive || isDisabled ? undefined : onClick}
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
