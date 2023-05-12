import React from 'react'
import { ListingStatus, Order } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Button, Mana } from 'decentraland-ui'
import { formatDistanceToNow, getDateAndMonthName } from '../../../lib/date'
import { formatWeiMANA } from '../../../lib/mana'
import { locations } from '../../../modules/routing/locations'
import { LinkedProfile } from '../../LinkedProfile'
import ListedBadge from '../../ListedBadge'
import { ManaToFiat } from '../../ManaToFiat'
import { DataTableType } from '../../Table/TableContent/TableContent.types'
import styles from './ListingsTable.module.css'

export const formatDataToTable = (orders: Order[]): DataTableType[] => {
  return orders.reduce((accumulator: DataTableType[], order: Order) => {
    const value: DataTableType = {
      [t('listings_table.owner')]: (
        <LinkedProfile
          className={styles.linkedProfileRow}
          address={order.owner}
        />
      ),
      [t('listings_table.published_date')]: getDateAndMonthName(
        order.createdAt
      ),
      [t('listings_table.expiration_date')]: formatDistanceToNow(
        +order.expiresAt,
        {
          addSuffix: true
        }
      ),
      [t('listings_table.issue_number')]: (
        <div className={styles.issuedIdContainer}>
          <div className={styles.badgeContainer}>
            {order.status === ListingStatus.OPEN &&
            order.expiresAt &&
            Number(order.expiresAt) >= Date.now() ? (
              <ListedBadge className={styles.badge} />
            ) : null}
            <div className={styles.row}>
              <span>
                #<span className={styles.issuedId}>{order.issuedId}</span>
              </span>
            </div>
          </div>
        </div>
      ),
      [t('listings_table.price')]: (
        <div className={styles.viewListingContainer}>
          <div className={styles.manaField}>
            <Mana className="manaField" network={order.network}>
              {formatWeiMANA(order.price)}
            </Mana>{' '}
            &nbsp;
            {'('}
            <ManaToFiat mana={order.price} />
            {')'}
          </div>
          {order && (
            <div>
              <Button
                inverted
                href={locations.nft(order.contractAddress, order.tokenId)}
                size="small"
              >
                {t('listings_table.view_listing')}
              </Button>
            </div>
          )}
        </div>
      )
    }
    return [...accumulator, value]
  }, [])
}
