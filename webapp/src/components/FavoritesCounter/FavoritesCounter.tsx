import React, { useMemo } from 'react'
import classNames from 'classnames'
import { Icon, IconProps } from 'decentraland-ui'
import { Props } from './FavoritesCounter.types'
import './FavoritesCounter.css'

const FavoritesCounter = (props: Props) => {
  const { className, isPickedByUser, count, isCollapsed = false } = props

  const counter = useMemo(
    () => (
      <span className="counter" aria-label="counter">
        {count}
      </span>
    ),
    [count]
  )
  const iconProps: Partial<IconProps> = {
    size: isCollapsed ? 'large' : undefined,
    fitted: isCollapsed
  }

  return (
    <div
      className={classNames(
        'FavoritesCounter',
        className,
        isCollapsed && 'Collapsed'
      )}
    >
      <div className="bubble">
        <Icon
          {...iconProps}
          name="bookmark"
          className={isPickedByUser ? 'show' : 'hidden'}
          aria-label="unpick favorited"
          role="button"
        />
        <Icon
          {...iconProps}
          name="bookmark outline"
          className={isPickedByUser ? 'hidden' : 'show'}
          aria-label="pick as favorite"
          role="button"
        />
        {!isCollapsed ? counter : null}
      </div>
      {isCollapsed ? counter : null}
    </div>
  )
}

export default React.memo(FavoritesCounter)
