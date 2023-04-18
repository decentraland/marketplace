import React from 'react'
import { useMobileMediaQuery } from 'decentraland-ui/dist/components/Media'
import { getAssetName, isNFT } from '../../../modules/asset/utils'
import { FavoritesCounter } from '../../FavoritesCounter'
import { Props } from './Title.types'
import styles from './Title.module.css'

const Title = ({ asset, isFavoritesEnabled }: Props) => {
  const isMobile = useMobileMediaQuery()

  return (
    <div className={styles.title}>
      <span className={styles.text}>{getAssetName(asset)}</span>
      {/* TODO (lists): this may be moved after the new detail page for unified markets */}
      {isFavoritesEnabled && !isMobile && !isNFT(asset) ? (
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
