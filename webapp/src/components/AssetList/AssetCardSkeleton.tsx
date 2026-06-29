import React from 'react'
import './AssetCardSkeleton.css'

// Loading placeholder shaped like an AssetCard (image + title/creator/price),
// with a shimmer sweep — shown as a grid while the catalog loads.
const AssetCardSkeleton = () => (
  <div className="AssetCardSkeleton">
    <div className="AssetCardSkeleton__image sk-shimmer" />
    <div className="AssetCardSkeleton__body">
      <div className="AssetCardSkeleton__line sk-shimmer" style={{ width: '72%' }} />
      <div className="AssetCardSkeleton__line sk-shimmer" style={{ width: '46%' }} />
      <div className="AssetCardSkeleton__line AssetCardSkeleton__price sk-shimmer" style={{ width: '38%' }} />
    </div>
  </div>
)

export default React.memo(AssetCardSkeleton)
