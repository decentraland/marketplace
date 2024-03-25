import React from 'react'
import classNames from 'classnames'
import intlFormat from 'date-fns/intlFormat'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Button } from 'decentraland-ui'
import { formatWeiMANA } from '../../../lib/mana'
import { isLandLocked } from '../../../modules/rental/utils'
import { LandLockedPopup } from '../../LandLockedPopup'
import Mana from '../../Mana/Mana'
import { IconButton } from '../IconButton'
import { Props } from './Sell.types'
import styles from './Sell.module.css'

const Sell = (props: Props) => {
  const { className, rental, order, nft, onEditOrder, userAddress, onListForSale } = props

  const areActionsLocked = rental !== null && isLandLocked(userAddress, rental, nft)

  return (
    <section className={classNames(styles.box, className)}>
      <div className={styles.header}>
        <h1 className={styles.title}>{order ? t('manage_asset_page.sell.selling_title') : t('manage_asset_page.sell.sell_title')}</h1>
        <div className={styles.action}>
          {order ? (
            <>
              <IconButton iconName="pencil" disabled={areActionsLocked} onClick={onEditOrder} />
            </>
          ) : (
            <LandLockedPopup asset={nft} rental={rental} userAddress={userAddress}>
              <Button className={styles.sellButton} disabled={areActionsLocked} onClick={onListForSale} fluid>
                {t('manage_asset_page.sell.list_for_sale')}
              </Button>
            </LandLockedPopup>
          )}
        </div>
      </div>
      {order ? (
        <div
          className={classNames(styles.content, {
            [styles.isLandLocked]: areActionsLocked
          })}
        >
          <div className={styles.column}>
            <div className={styles.columnHeader}>{t('manage_asset_page.sell.price')}</div>
            <div className={styles.columnContent}>
              <Mana showTooltip withTooltip size={'medium'} network={order.network}>
                {formatWeiMANA(order.price)}
              </Mana>
            </div>
          </div>
          <div className={styles.column}>
            <div className={styles.columnHeader}>{t('manage_asset_page.sell.expiration_date')}</div>
            <div className={styles.columnContent}>
              {intlFormat(
                order.expiresAt *
                  // if the expire date length is 10 then it is assumed that it is in seconds
                  (order.expiresAt.toString().length === 10 ? 1000 : 1)
              )}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}

export default React.memo(Sell)
