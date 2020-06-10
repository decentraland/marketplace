import React, { useCallback } from 'react'
import { locations } from '../../modules/routing/locations'
import { NFTImage } from '../NFTImage'
import { Props } from './NFTAction.types'
import './NFTAction.css'

const NFTAction = (props: Props) => {
  const { nft, children, onNavigate } = props
  const handleBack = useCallback(
    () => onNavigate(locations.ntf(nft.contractAddress, nft.tokenId)),
    [onNavigate, nft]
  )
  return (
    <div className="NFTAction">
      <div className="back" onClick={handleBack} />
      <div className="action">
        <div className="left">
          <div className="nft-image-wrapper">
            <NFTImage nft={nft} zoom={1} />
          </div>
        </div>
        <div className="right">{children}</div>
      </div>
    </div>
  )
}

export default React.memo(NFTAction)
