import React from 'react'
import { Network } from '@dcl/schemas'
import { useMobileMediaQuery } from 'decentraland-ui/dist/components/Media'
import { getAssetName, isNFT } from '../../../modules/asset/utils'
import { FavoritesCounter } from '../../FavoritesCounter'
import { Props } from './Title.types'
import styles from './Title.module.css'

const Title = ({ asset }: Props) => {
  const isMobile = useMobileMediaQuery()

  return (
    <div className={styles.title}>
      <span className={styles.text}>
        {getAssetName(asset)}{' '}
        {isNFT(asset) && asset.issuedId ? `#${asset.issuedId}` : ''}{' '}
      </span>
      {/* TODO (lists): this may be moved after the new detail page for unified markets */}
      {!isMobile && !isNFT(asset) && asset.network === Network.MATIC ? (
        <FavoritesCounter
          isCollapsed
          className={styles.favorites}
          item={asset}
        />
      ) : null}
    </div>
  )
}

export default React.memo(Title)
