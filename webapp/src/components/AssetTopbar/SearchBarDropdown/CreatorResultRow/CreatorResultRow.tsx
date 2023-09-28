import { Link } from 'react-router-dom'
import { Profile } from 'decentraland-dapps/dist/containers'
import { locations } from '../../../../modules/routing/locations'
import { CreatorAccount } from '../../../../modules/account/types'
import { AssetType } from '../../../../modules/asset/types'
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
        section: Section.WEARABLES
      })}
      onClick={() => onClick(creator)}
    >
      <div className="Owner">
        <Profile size="huge" address={creator.address} />
      </div>
    </Link>
  )
}

export default CreatorsResultItemRow
