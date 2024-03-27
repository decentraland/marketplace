import React from 'react'
import { isLand } from '../../../modules/nft/utils'
import { AssetImage } from '../../AssetImage'
import { Coordinate } from '../../Coordinate'
import BaseDetail from '../BaseDetail'
import { BidList } from '../BidList'
import { Description } from '../Description'
import { JumpIn } from '../JumpIn'
import { Owner } from '../Owner'
import { ProximityHighlights } from '../ProximityHighlights'
import { RentalHistory } from '../RentalHistory'
import { SaleRentActionBox } from '../SaleRentActionBox'
import { TransactionHistory } from '../TransactionHistory'
import { Props } from './ParcelDetail.types'

const ParcelDetail = ({ nft, order, rental }: Props) => {
  const parcel = nft.data.parcel!
  const { x, y } = parcel

  return (
    <BaseDetail
      asset={nft}
      rental={rental ?? undefined}
      assetImage={<AssetImage asset={nft} isDraggable withNavigation hasPopup showUpdatedDateWarning />}
      showDetails={isLand(nft)}
      isOnSale={!!nft.activeOrderId}
      badges={
        <>
          <Coordinate x={Number(x)} y={Number(y)} />
          <JumpIn x={Number(x)} y={Number(y)} />
        </>
      }
      left={
        <>
          <Description text={parcel.description} />
          <Owner asset={nft} />
          <ProximityHighlights nft={nft} />
        </>
      }
      actions={<SaleRentActionBox order={order} nft={nft} rental={rental} />}
      box={<></>}
      below={
        <>
          <BidList nft={nft} />
          <TransactionHistory asset={nft} />
          <RentalHistory asset={nft} />
        </>
      }
    />
  )
}

export default React.memo(ParcelDetail)
