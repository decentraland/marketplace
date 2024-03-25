import { Link } from 'react-router-dom'
import { Item } from '@dcl/schemas'
import { Profile } from 'decentraland-dapps/dist/containers'
import { getAssetUrl } from '../../../../modules/asset/utils'
import { AssetImage } from '../../../AssetImage/'
import styles from './CollectibleResultItemRow.module.css'

type CollectibleResultItemRowProps = {
  item: Item
  onClick: (item: Item) => void
}

const CollectibleResultItemRow = ({ item, onClick }: CollectibleResultItemRowProps) => {
  return (
    <Link to={getAssetUrl(item)} onClick={() => onClick(item)}>
      <div className={styles.collectibleItemRowContainer}>
        <AssetImage asset={item} isSmall />
        <div className={styles.itemDataContainer}>
          <span className={styles.itemName}>{item.name}</span>
          <span className={styles.creator}>
            <Profile address={item.creator} textOnly />
          </span>
        </div>
      </div>
    </Link>
  )
}

export default CollectibleResultItemRow
