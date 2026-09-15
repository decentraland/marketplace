import React from 'react'
import { applyEstateSnapshot } from '../../../modules/nft/estate/utils'
import { useEstateSnapshot } from '../../../modules/nft/hooks'
import { AssetImage } from '../../AssetImage'
import { Props } from './Map.types'

const Map = (props: Props) => {
  const { asset, className } = props

  // The composition here is what the owner reviews before listing. Read it from the registry so the map
  // is the authoritative one and draw it strictly (a stale tile layer would otherwise re-add parcels the
  // Estate no longer holds). For non-Estate assets this is a no-op.
  const estateSnapshot = useEstateSnapshot(asset)
  const reviewedAsset = estateSnapshot.snapshot ? applyEstateSnapshot(asset, estateSnapshot.snapshot) : asset

  return (
    <div className={className}>
      <AssetImage asset={reviewedAsset} hasBadges={true} strictEstateSelection={!!estateSnapshot.snapshot} />
    </div>
  )
}

export default React.memo(Map)
