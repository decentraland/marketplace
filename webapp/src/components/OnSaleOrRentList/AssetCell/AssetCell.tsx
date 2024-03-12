import React from 'react'
import { Link } from 'react-router-dom'
import { NFTCategory } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { locations } from '../../../modules/routing/locations'
import { AssetImage } from '../../AssetImage'
import { Props } from './AssetCell.types'
import styles from './AssetCell.module.css'

const AssetCell = ({ asset, link: linkProp }: Props) => {
  let subtitle: string | undefined

  switch (asset.category) {
    case NFTCategory.ESTATE: {
      subtitle = t('global.parcel_count', {
        count: asset.data.estate!.parcels.length
      })
      break
    }
    case NFTCategory.PARCEL: {
      const { x, y } = asset.data.parcel!
      subtitle = `${x},${y}`
      break
    }
  }

  const link = linkProp
    ? linkProp
    : 'tokenId' in asset
      ? locations.nft(asset.contractAddress, asset.tokenId)
      : locations.item(asset.contractAddress, asset.itemId)

  return (
    <Link to={link}>
      <div className={styles.firstCell}>
        <div className={styles.imageContainer}>
          <AssetImage asset={asset} isSmall />
        </div>
        <div>
          <div className={styles.title}>{asset.name}</div>
          {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
        </div>
      </div>
    </Link>
  )
}

export default React.memo(AssetCell)
