import React from 'react'
import { Link } from 'react-router-dom'
import intlFormat from 'date-fns/intlFormat'
import classNames from 'classnames'
import { Button } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { locations } from '../../../modules/routing/locations'
import { formatWeiMANA } from '../../../lib/mana'
import Mana from '../../Mana/Mana'
import { IconButton } from '../IconButton'
import { Props } from './Sell.types'
import styles from './Sell.module.css'

const Sell = (props: Props) => {
  const {
    className,
    isBeingRented,
    order,
    nft: { contractAddress, tokenId },
    onEditOrder
  } = props

  return (
    <section className={classNames(styles.box, className)}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          {order
            ? t('manage_asset_page.sell.selling_title')
            : t('manage_asset_page.sell.sell_title')}
        </h1>
        <div className={styles.action}>
          {order ? (
            <IconButton
              iconName="pencil"
              disabled={isBeingRented}
              onClick={onEditOrder}
            />
          ) : (
            <Button
              className={styles.sellButton}
              disabled={isBeingRented}
              as={Link}
              to={locations.sell(contractAddress, tokenId)}
              fluid
            >
              {t('manage_asset_page.sell.list_for_sale')}
            </Button>
          )}
        </div>
      </div>
      {order ? (
        <div
          className={classNames(styles.content, {
            [styles.isBeingRented]: isBeingRented
          })}
        >
          <div className={styles.column}>
            <div className={styles.columnHeader}>
              {t('manage_asset_page.sell.price')}
            </div>
            <div className={styles.columnContent}>
              <Mana withTooltip size={'medium'} network={order.network}>
                {formatWeiMANA(order.price)}
              </Mana>
            </div>
          </div>
          <div className={styles.column}>
            <div className={styles.columnHeader}>
              {t('manage_asset_page.sell.expiration_date')}
            </div>
            <div className={styles.columnContent}>
              {intlFormat(order.expiresAt)}
            </div>
          </div>
        </div>
      ) : null}
      {isBeingRented ? (
        <div className={styles.rentedMessage}>
          {t('manage_asset_page.sell.cant_sell_rented_land')}
        </div>
      ) : null}
    </section>
  )
}

export default React.memo(Sell)
