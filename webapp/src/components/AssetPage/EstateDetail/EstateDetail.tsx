import React from 'react'
import classNames from 'classnames'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Badge } from 'decentraland-ui'
import { applyEstateSnapshot } from '../../../modules/nft/estate/utils'
import { useEstateSnapshot } from '../../../modules/nft/hooks'
import { AssetImage } from '../../AssetImage'
import BaseDetail from '../BaseDetail'
import { BidList } from '../BidList'
import { Description } from '../Description'
import { JumpIn } from '../JumpIn'
import { Owner } from '../Owner'
import { ProximityHighlights } from '../ProximityHighlights'
import { RentalHistory } from '../RentalHistory'
import { SaleRentActionBox } from '../SaleRentActionBox'
import { TransactionHistory } from '../TransactionHistory'
import { ParcelCoordinates } from './ParcelCoordinates'
import { Props } from './EstateDetail.types'
import './EstateDetail.css'

const EstateDetail = ({ nft, order, rental }: Props) => {
  // The composition shown here comes from the indexer, which can be behind. Read it from the registry so
  // the map a buyer or seller reviews is the one their action will bind to, and draw it strictly (the
  // registry set is complete, so the large-estate tile expansion would only add stale parcels).
  const estateSnapshot = useEstateSnapshot(nft)
  const reviewedNft = estateSnapshot.snapshot ? applyEstateSnapshot(nft, estateSnapshot.snapshot) : nft
  const estate = reviewedNft.data.estate!
  let x = 0
  let y = 0

  if (estate.size > 0) {
    x = estate.parcels[0].x
    y = estate.parcels[0].y
  }

  return (
    <BaseDetail
      className="EstateDetail"
      asset={nft}
      rental={rental ?? undefined}
      showDetails
      assetImage={
        <>
          <AssetImage
            className={classNames(estate.size === 0 && 'dissolved')}
            asset={reviewedNft}
            isDraggable
            withNavigation
            hasPopup
            showUpdatedDateWarning
            strictEstateSelection={!!estateSnapshot.snapshot}
          />
          {estate.size === 0 && (
            <div className="dissolved-wrapper">
              <div className="dissolved-notice">{t('estate_detail.dissolved')}</div>
            </div>
          )}
        </>
      }
      actions={<SaleRentActionBox order={order} nft={nft} rental={rental} />}
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
          <ProximityHighlights nft={reviewedNft} />
        </>
      }
      box={<></>}
      below={
        <>
          <BidList nft={nft} />
          {estate.size > 0 && <ParcelCoordinates parcelCoordinates={estate.parcels} total={estate.size} />}
          <TransactionHistory asset={nft} />
          <RentalHistory asset={nft} />
        </>
      }
    />
  )
}

export default React.memo(EstateDetail)
