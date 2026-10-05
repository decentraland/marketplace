import React from 'react'
import { Link } from 'react-router-dom'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Button, Icon, Mana, Modal, ModalNavigation } from 'decentraland-ui'
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

const CancelledOrdersModal = ({ open, trades, total, onClose }: ModalProps) => (
  <Modal open={open} size="small" onClose={onClose} className={styles.modal}>
    <ModalNavigation title={t('cancelled_orders_banner.modal_title')} onClose={onClose} />
    <Modal.Content>
      <p className={styles.description}>{t('cancelled_orders_banner.modal_description')}</p>
      <ul className={styles.list} aria-label={t('cancelled_orders_banner.modal_title')}>
        {trades.map(trade => {
          const name = trade.asset.name ?? t('cancelled_orders_banner.unknown_asset')
          return (
            <li key={trade.id} className={styles.row}>
              <div className={styles.thumbnail}>{trade.asset.image ? <img src={trade.asset.image} alt={name} /> : null}</div>
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
      {total > trades.length ? <p className={styles.more}>{t('cancelled_orders_banner.more', { shown: trades.length, total })}</p> : null}
    </Modal.Content>
  </Modal>
)

export default React.memo(CancelledOrdersModal)
