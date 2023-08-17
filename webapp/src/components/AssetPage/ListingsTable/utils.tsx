import { Link } from 'react-router-dom'
import { ListingStatus, Order } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Button, Icon, Mana } from 'decentraland-ui'
import { formatDistanceToNow, getDateAndMonthName } from '../../../lib/date'
import { formatWeiMANA } from '../../../lib/mana'
import { isLegacyOrder } from '../../../lib/orders'
import { locations } from '../../../modules/routing/locations'
import { LinkedProfile } from '../../LinkedProfile'
import ListedBadge from '../../ListedBadge'
import { ManaToFiat } from '../../ManaToFiat'
import { DataTableType } from '../../Table/TableContent/TableContent.types'
import styles from './ListingsTable.module.css'

export const formatDataToTable = (orders: Order[], isMobile = false): DataTableType[] => {
  return orders.reduce((accumulator: DataTableType[], order: Order) => {
    const value: DataTableType = {
      [t('listings_table.owner')]: <LinkedProfile className={styles.linkedProfileRow} address={order.owner} />,
      ...(!isMobile && {
        [t('listings_table.published_date')]: getDateAndMonthName(order.createdAt)
      }),
      ...(!isMobile && {
        [t('listings_table.expiration_date')]: formatDistanceToNow(+order.expiresAt * (isLegacyOrder(order) ? 1 : 1000), {
          addSuffix: true
        })
      }),
      ...(!isMobile && {
        [t('listings_table.issue_number')]: (
          <div className={styles.issuedIdContainer}>
            <div className={styles.badgeContainer}>
              {order.status === ListingStatus.OPEN &&
              order.expiresAt &&
              (isLegacyOrder(order) ? order.expiresAt : order.expiresAt * 1000) >= Date.now() ? (
                <ListedBadge className={styles.badge} />
              ) : null}
              <div className={styles.row}>
                <span>
                  #<span className={styles.issuedId}>{order.issuedId}</span>
                </span>
              </div>
            </div>
          </div>
        )
      }),
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
              <Button inverted as={Link} to={locations.nft(order.contractAddress, order.tokenId)} size="small">
                {isMobile ? <Icon name="chevron right" className={styles.gotToNFT} /> : t('listings_table.view_listing')}
              </Button>
            </div>
          )}
        </div>
      )
    }
    return [...accumulator, value]
  }, [])
}
