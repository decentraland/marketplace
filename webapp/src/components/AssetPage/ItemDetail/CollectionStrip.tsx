import React from 'react'
import { Link } from 'react-router-dom'
import { Item } from '@dcl/schemas'
import { getAssetImage, getAssetName, getAssetUrl } from '../../../modules/asset/utils'
import styles from './CollectionStrip.module.css'

type Props = {
  items: Item[]
  currentItemId: string
}

// Vertical strip of the other items in the same collection, shown beside the
// big preview. Clicking a thumbnail navigates to that item.
const CollectionStrip = ({ items, currentItemId }: Props) => {
  const others = items.filter(item => item.id !== currentItemId).slice(0, 5)
  if (others.length === 0) return null

  return (
    <div className={styles.strip}>
      {others.map(item => (
        <Link key={item.id} to={getAssetUrl(item)} className={styles.thumb} title={getAssetName(item)}>
          <img src={getAssetImage(item)} alt={getAssetName(item)} loading="lazy" />
        </Link>
      ))}
    </div>
  )
}

export default React.memo(CollectionStrip)
