import { Link } from 'react-router-dom'
import Profile from 'decentraland-dapps/dist/containers/Profile'
import { CreatorAccount } from '../../../../modules/account/types'
import { AssetType } from '../../../../modules/asset/types'
import { locations } from '../../../../modules/routing/locations'
import { SortBy } from '../../../../modules/routing/types'
import { VendorName } from '../../../../modules/vendor'
import { Section } from '../../../../modules/vendor/decentraland'
import styles from './CreatorResultRow.module.css'

type CreatorResultRowProps = {
  creator: CreatorAccount
  onClick: (creator: CreatorAccount) => void
}

const CreatorsResultItemRow = ({ creator, onClick }: CreatorResultRowProps) => {
  return (
    <Link
      className={styles.creatorRowContainer}
      to={locations.account(creator.address, {
        assetType: AssetType.ITEM,
        section: Section.WEARABLES,
        vendor: VendorName.DECENTRALAND,
        page: 1,
        sortBy: SortBy.NEWEST
      })}
      onClick={() => onClick(creator)}
    >
      <div className={styles.owner}>
        <Profile size="huge" imageOnly address={creator.address} />
        <span> {creator.name} </span>
      </div>
    </Link>
  )
}

export default CreatorsResultItemRow
