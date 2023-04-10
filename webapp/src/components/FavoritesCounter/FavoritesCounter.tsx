import React, { useCallback, useMemo } from 'react'
import classNames from 'classnames'
import { Icon } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { getAnalytics } from 'decentraland-dapps/dist/modules/analytics/utils'
import * as events from '../../utils/events'
import { Props } from './FavoritesCounter.types'
import styles from './FavoritesCounter.module.css'

/* TODO (lists):
    - An idea for more accessibility: Tooltip for the whole component with the name of the action
    - The div may be converted to a button with the withTooltip prop.
*/

const formatter = Intl.NumberFormat('en', { notation: 'compact' })

const FavoritesCounter = (props: Props) => {
  const {
    className,
    count,
    isPickedByUser,
    isCollapsed = false,
    item,
    onCounterClick,
    onPick,
    onUnpick
  } = props

  const handleOnCounterClick = useCallback(() => {
    getAnalytics().track(events.OPEN_FAVORITES_MODAL, {
      item
    })
    onCounterClick(item)
  }, [item, onCounterClick])

  const counter = useMemo(
    () => (
      <span
        role="button"
        onClick={count > 0 && isCollapsed ? handleOnCounterClick : undefined}
        className={styles.counter}
        aria-label="counter"
        data-testid="favorites-counter-number"
      >
        {formatter.format(count)}
      </span>
    ),
    [count, isCollapsed, handleOnCounterClick]
  )

  const onClick = useCallback(
    (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
      e.preventDefault()
      e.stopPropagation()
      const handler = isPickedByUser ? onUnpick : onPick
      return handler(item)
    },
    [isPickedByUser, item, onPick, onUnpick]
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
      <div
        className={styles.bubble}
        onClick={onClick}
        data-testid="favorites-counter-bubble"
      >
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
