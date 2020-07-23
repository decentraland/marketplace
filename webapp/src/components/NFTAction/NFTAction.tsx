import React from 'react'
import { Link } from 'react-router-dom'

import { locations } from '../../modules/routing/locations'
import { NFTImage } from '../NFTImage'
import { Row } from '../Layout/Row'
import { Column } from '../Layout/Column'
import { Props } from './NFTAction.types'
import './NFTAction.css'

const NFTAction = (props: Props) => {
  const { nft, children } = props
  return (
    <div className="NFTAction">
      <Link to={locations.nft(nft.contractAddress, nft.tokenId)}>
        <div className="back" />
      </Link>
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
