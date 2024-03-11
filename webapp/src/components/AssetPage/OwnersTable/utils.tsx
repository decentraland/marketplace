import { ListingStatus } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Icon } from 'decentraland-ui'
import { Link } from 'react-router-dom'
import { Asset } from '../../../modules/asset/types'
import { locations } from '../../../modules/routing/locations'
import { OwnersResponse } from '../../../modules/vendor/decentraland'
import { LinkedProfile } from '../../LinkedProfile'
import ListedBadge from '../../ListedBadge'
import { DataTableType } from '../../Table/TableContent/TableContent.types'
import styles from './OwnersTable.module.css'

export const formatDataToTable = (owners: OwnersResponse[], asset: Asset): DataTableType[] => {
  return owners?.map((owner: OwnersResponse) => {
    const value: DataTableType = {
      [t('owners_table.owner')]: <LinkedProfile className={styles.linkedProfileRow} address={owner.ownerId} />,
      [t('owners_table.issue_number')]: (
        <div className={styles.issuedIdContainer}>
          <div className={styles.row}>
            {owner.orderStatus === ListingStatus.OPEN &&
            !!owner.orderExpiresAt &&
            (owner.orderExpiresAt.length === 10 ? +owner.orderExpiresAt * 1000 : +owner.orderExpiresAt) >= Date.now() ? (
              <ListedBadge className={styles.badge} />
            ) : null}
            #<span className={styles.issuedId}>{owner.issuedId}</span>
          </div>
          {!!owner && (
            <div>
              {asset?.contractAddress && owner.tokenId && (
                <Link to={locations.nft(asset.contractAddress, owner.tokenId)}>
                  <Icon name="chevron right" className={styles.gotToNFT} />
                </Link>
              )}
            </div>
          )}
        </div>
      )
    }
    return value
  })
}
