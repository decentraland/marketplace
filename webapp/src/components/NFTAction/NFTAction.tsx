import React, { useCallback } from 'react'
import { locations } from '../../modules/routing/locations'
import { NFTImage } from '../NFTImage'
import { Row } from '../Layout/Row'
import { Column } from '../Layout/Column'
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
      <Row>
        <Column align="left">
          <div className="nft-image-wrapper">
            <NFTImage nft={nft} zoom={1} />
          </div>
        </Column>
        <Column align="right">{children}</Column>
      </Row>
    </div>
  )
}

export default React.memo(NFTAction)
