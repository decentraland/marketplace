import React from 'react'
import { getAssetName, isNFT } from '../../../modules/asset/utils'
import { FavoritesCounter } from '../../FavoritesCounter'
import { Props } from './Title.types'
import styles from './Title.module.css'

const Title = ({ asset, isFavoritesEnabled }: Props) => {
  return (
    <div className={styles.title}>
      <span className={styles.text}>{getAssetName(asset)}</span>
      {/* TODO (lists): this may be moved after the new detail page for unified markets */}
      {isFavoritesEnabled && !isNFT(asset) ? (
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
