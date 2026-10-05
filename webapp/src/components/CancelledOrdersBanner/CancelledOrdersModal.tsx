import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Button, Icon, Loader, Mana, Modal, ModalNavigation } from 'decentraland-ui'
import { formatWeiMANA } from '../../lib/mana'
import { CancelledTrade, CancelledTradeType } from '../../modules/vendor/decentraland/cancelledTrades/types'
import { getRecreateLink } from './utils'
import { ModalProps } from './CancelledOrdersBanner.types'
import styles from './CancelledOrdersBanner.module.css'

const RecreateButton = ({ trade }: { trade: CancelledTrade }) => {
  const link = getRecreateLink(trade)
  if (!link) return null

  return link.isExternal ? (
    <Button as="a" href={link.url} target="_blank" rel="noopener noreferrer" role="link" primary size="small" className={styles.recreate}>
      {t('cancelled_orders_banner.recreate')}
      <Icon name="external alternate" className={styles.externalIcon} />
    </Button>
  ) : (
    <Button as={Link} to={link.url} role="link" primary size="small" className={styles.recreate}>
      {t('cancelled_orders_banner.recreate')}
    </Button>
  )
}

// Decorative: the name is next to it. Hidden on load errors instead of showing a broken image.
const Thumbnail = ({ src }: { src: string | null }) => {
  const [hasFailed, setHasFailed] = useState(false)
  const handleError = useCallback(() => setHasFailed(true), [])

  return <div className={styles.thumbnail}>{src && !hasFailed ? <img src={src} alt="" loading="lazy" onError={handleError} /> : null}</div>
}

// Starts the next page before the end of the list is reached.
const LOAD_MORE_MARGIN = '0px 0px 240px 0px'

const useLoadMoreSentinel = (shouldLoad: boolean, onLoadMore: () => void) => {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!shouldLoad || !sentinel) return

    const observer = new IntersectionObserver(([entry]) => entry.isIntersecting && onLoadMore(), {
      root: scrollerRef.current,
      rootMargin: LOAD_MORE_MARGIN
    })
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [shouldLoad, onLoadMore])

  return { scrollerRef, sentinelRef }
}

const CancelledOrdersModal = ({ open, trades, total, hasMore, isLoadingMore, error, onLoadMore, onClose }: ModalProps) => {
  const canLoadMore = hasMore && !isLoadingMore && !error
  const { scrollerRef, sentinelRef } = useLoadMoreSentinel(open && canLoadMore, onLoadMore)

  return (
    <Modal open={open} size="small" onClose={onClose} className={styles.modal}>
      <ModalNavigation title={t('cancelled_orders_banner.modal_title')} onClose={onClose} />
      <Modal.Content>
        <p className={styles.description}>{t('cancelled_orders_banner.modal_description')}</p>
        <div className={styles.summary}>
          <span className={styles.count}>{t('cancelled_orders_banner.count', { count: total })}</span>
          {hasMore ? <span>{t('cancelled_orders_banner.loaded', { shown: trades.length, total })}</span> : null}
        </div>
        <div className={styles.scroller} ref={scrollerRef}>
          <ul className={styles.list} aria-label={t('cancelled_orders_banner.modal_title')} aria-busy={isLoadingMore}>
            {trades.map(trade => {
              const name = trade.asset.name ?? t('cancelled_orders_banner.unknown_asset')
              return (
                <li key={trade.id} className={styles.row}>
                  <Thumbnail src={trade.asset.image} />
                  <div className={styles.details}>
                    <span className={styles.name}>{name}</span>
                    <span className={styles.type}>
                      {t(`cancelled_orders_banner.type.${trade.type}`)}
                      {/* Primary sales can't be set up in the Marketplace */}
                      {trade.type === CancelledTradeType.PUBLIC_ITEM_ORDER ? (
                        <span className={styles.hint}> · {t('cancelled_orders_banner.recreated_in_builder')}</span>
                      ) : null}
                    </span>
                  </div>
                  <div className={styles.price}>
                    {trade.price ? (
                      <Mana network={trade.network} inline>
                        {formatWeiMANA(trade.price.amount)}
                      </Mana>
                    ) : (
                      t('cancelled_orders_banner.no_price')
                    )}
                  </div>
                  <RecreateButton trade={trade} />
                </li>
              )
            })}
          </ul>
          {canLoadMore ? <div ref={sentinelRef} className={styles.sentinel} /> : null}
          <div role="status" className={styles.status}>
            {isLoadingMore ? (
              <>
                <Loader active inline size="tiny" />
                {t('cancelled_orders_banner.loading_more')}
              </>
            ) : null}
          </div>
          {error && hasMore ? (
            <div role="alert" className={styles.footer}>
              {t('cancelled_orders_banner.load_more_error')}
              <Button type="button" size="small" secondary className={styles.retry} onClick={onLoadMore}>
                {t('cancelled_orders_banner.retry')}
              </Button>
            </div>
          ) : null}
        </div>
      </Modal.Content>
    </Modal>
  )
}

export default React.memo(CancelledOrdersModal)
