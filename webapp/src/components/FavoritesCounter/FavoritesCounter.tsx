import React, { useMemo } from 'react'
import classNames from 'classnames'
import { Icon } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Props } from './FavoritesCounter.types'
import styles from './FavoritesCounter.module.css'

/* TODO:
    - An idea for more accesibility: Tooltip for the whole component with the name of the action
    - The div may be converted to a button with the withTooltip prop.
*/

const formatter = Intl.NumberFormat('en', { notation: 'compact' })

const FavoritesCounter = (props: Props) => {
  const { className, isPickedByUser, count, isCollapsed = false } = props

  const counter = useMemo(
    () => (
      <span className={styles.counter} aria-label="counter">
        {formatter.format(count)}
      </span>
    ),
    [count]
  )

  return (
    <div
      className={classNames(
        styles.FavoritesCounter,
        className,
        isCollapsed && styles.Collapsed
      )}
      aria-label={
        isPickedByUser
          ? t('favorites_counter.unpick_label')
          : t('favorites_counter.pick_label')
      }
      role="button"
      data-testid="favorites-counter"
    >
      <div className={styles.bubble}>
        <Icon
          size={isCollapsed ? 'large' : undefined}
          fitted={isCollapsed}
          name={isPickedByUser ? 'bookmark' : 'bookmark outline'}
        />
        {!isCollapsed ? counter : null}
      </div>
      {isCollapsed ? counter : null}
    </div>
  )
}

export default React.memo(FavoritesCounter)
