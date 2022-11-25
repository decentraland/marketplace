import React from 'react'
import { Link } from 'react-router-dom'
import intlFormat from 'date-fns/intlFormat'
import classNames from 'classnames'
import { Button } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { isParcel } from '../../../modules/nft/utils'
import { locations } from '../../../modules/routing/locations'
import { formatWeiMANA } from '../../../lib/mana'
import Mana from '../../Mana/Mana'
import { IconButton } from '../IconButton'
import { Props } from './Sell.types'
import styles from './Sell.module.css'

const Sell = (props: Props) => {
  const {
    className,
    isLandLocked,
    order,
    nft,
    onEditOrder,
    onCancelOrder
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
            <>
              <IconButton
                iconName="pencil"
                disabled={isLandLocked}
                onClick={onEditOrder}
              />
              <IconButton
                iconName="trash alternate"
                disabled={isLandLocked}
                onClick={onCancelOrder}
              />
            </>
          ) : (
            <Button
              className={styles.sellButton}
              disabled={isLandLocked}
              as={Link}
              to={locations.sell(nft.contractAddress, nft.tokenId)}
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
            [styles.isLandLocked]: isLandLocked
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
      {isLandLocked ? (
        <div className={styles.rentedMessage}>
          {t('manage_asset_page.sell.cant_sell_rented_land', {
            asset: isParcel(nft) ? t('global.the_parcel') : t('global.the_estate')
          })}
        </div>
      ) : null}
    </section>
  )
}

export default React.memo(Sell)
