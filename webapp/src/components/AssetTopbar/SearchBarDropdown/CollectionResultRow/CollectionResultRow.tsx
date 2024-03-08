import { Profile } from 'decentraland-dapps/dist/containers'
import { BuilderCollectionAttributes } from '../../../../modules/vendor/decentraland/builder/types'
import CollectionImage from '../../../CollectionImage'
import styles from './CollectionResultRow.module.css'

type CollectionResultRowProps = {
  collection: BuilderCollectionAttributes
  onClick: () => void
  'data-testid'?: string
}

const CollectionResultRow = ({ collection, onClick, 'data-testid': dataTestId }: CollectionResultRowProps) => {
  return (
    <div className={styles.collectionRowContainer} onClick={onClick} data-testid={dataTestId}>
      <div className={styles.image}>
        <CollectionImage contractAddress={collection.contract_address} />
      </div>
      <div className={styles.itemDataContainer}>
        <span className={styles.collectionName}>{collection.name}</span>
        <span className={styles.creator}>
          <Profile address={collection.eth_address} textOnly />
        </span>
      </div>
    </div>
  )
}

export default CollectionResultRow
