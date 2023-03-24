import React, { useMemo } from 'react'
import classNames from 'classnames'
import { Icon, IconProps } from 'decentraland-ui'
import { Props } from './FavoritesCounter.types'
import styles from './FavoritesCounter.module.css'

const FavoritesCounter = (props: Props) => {
  const { className, isPickedByUser, count, isCollapsed = false } = props

  const counter = useMemo(
    () => (
      <span className={styles.counter} aria-label="counter">
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
        styles.FavoritesCounter,
        className,
        isCollapsed && styles.Collapsed
      )}
    >
      <div className={styles.bubble}>
        <Icon
          {...iconProps}
          name="bookmark"
          className={isPickedByUser ? styles.show : styles.hidden}
          aria-label="unpick favorited"
          role="button"
        />
        <Icon
          {...iconProps}
          name="bookmark outline"
          className={isPickedByUser ? styles.hidden : styles.show}
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
