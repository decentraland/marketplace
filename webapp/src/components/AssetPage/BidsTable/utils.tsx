import { Bid } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Mana } from 'decentraland-ui'
import { formatDistanceToNow, getDateAndMonthName } from '../../../lib/date'
import { formatWeiMANA } from '../../../lib/mana'
import { LinkedProfile } from '../../LinkedProfile'
import { ManaToFiat } from '../../ManaToFiat'
import { DataTableType } from '../../Table/TableContent/TableContent.types'
import styles from './BidsTable.module.css'

export const formatDataToTable = (
  bids: Bid[],
  userAddress?: string
): DataTableType[] => {
  return bids.reduce((accumulator: DataTableType[], bid: Bid) => {
    if (bid.bidAddress !== userAddress) {
      const value: DataTableType = {
        [t('offers_table.from')]: (
          <LinkedProfile
            className={styles.linkedProfileRow}
            address={bid.bidder}
          />
        ),
        [t('offers_table.published_date')]: getDateAndMonthName(bid.createdAt),
        [t('offers_table.expiration_date')]: formatDistanceToNow(
          +bid.expiresAt,
          {
            addSuffix: true
          }
        ),
        [t('listings_table.price')]: (
          <div className={styles.viewListingContainer}>
            <div className={styles.manaField}>
              <Mana className="manaField" network={bid.network}>
                {formatWeiMANA(bid.price)}
              </Mana>{' '}
              &nbsp;
              {'('}
              <ManaToFiat mana={bid.price} />
              {')'}
            </div>
          </div>
        )
      }
      return [...accumulator, value]
    } else {
      return accumulator
    }
  }, [])
}
