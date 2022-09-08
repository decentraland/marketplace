import React, { useCallback } from 'react'
import { Button } from 'decentraland-ui'
import classNames from 'classnames'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import intlFormat from 'date-fns/intlFormat'
import Mana from '../../Mana/Mana'
import { formatWeiMANA } from '../../../lib/mana'
import { IconButton } from '../IconButton'
import styles from './Sell.module.css'
import { Props } from './Sell.types'

const Sell = (props: Props) => {
  const { className, order, onListForSale } = props
  const handleOnEdit = useCallback(() => undefined, [])

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
            <IconButton iconName="pencil" onClick={handleOnEdit} />
          ) : (
            <Button className={styles.listForSale} onClick={onListForSale}>
              {t('manage_asset_page.sell.list_for_sale')}
            </Button>
          )}
        </div>
      </div>
      {order ? (
        <div className={styles.content}>
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
    </section>
  )
}

export default React.memo(Sell)
