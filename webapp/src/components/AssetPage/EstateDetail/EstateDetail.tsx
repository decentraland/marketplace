import React from 'react'
import { Badge } from 'decentraland-ui'
import { Network } from '../Network'
import { Description } from '../Description'
import { Props } from './EstateDetail.types'
import { Owner } from '../Owner'
import Price from '../Price'
import Expiration from '../Expiration'
import { Actions } from '../Actions'
import { Bids } from '../Bids'
import { TransactionHistory } from '../TransactionHistory'
import { JumpIn } from '../JumpIn'
import { ProximityHighlights } from '../ProximityHighlights'
import { ParcelCoordinates } from './ParcelCoordinates'
import BaseDetail from '../BaseDetail'
import { AssetImage } from '../../AssetImage'

const EstateDetail = ({ nft }: Props) => {
  const estate = nft.data.estate!
  const { x, y } = estate.parcels[0]

  return (
    <BaseDetail
      asset={nft}
      assetImage={
        <AssetImage asset={nft} isDraggable withNavigation hasPopup />
      }
      isOnSale={!!nft.activeOrderId}
      badges={
        <>
          <Badge color="#37333d">{estate.size.toLocaleString()} LAND</Badge>
          {estate.size > 0 ? <JumpIn x={x} y={y} /> : null}
        </>
      }
      left={
        <>
          <Description text={estate.description} />
          <Owner asset={nft} />
          <ProximityHighlights nft={nft} />
        </>
      }
      box={
        <>
          <Price asset={nft} />
          <Network asset={nft} />
          <Actions nft={nft} />
          <Expiration />
        </>
      }
      below={
        <>
          <Bids nft={nft} />
          <ParcelCoordinates estateId={nft.tokenId} />
          <TransactionHistory nft={nft} />
        </>
      }
    />
  )
}

export default React.memo(EstateDetail)
