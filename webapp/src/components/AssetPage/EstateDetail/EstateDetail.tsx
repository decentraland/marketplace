import React from 'react'
import classNames from 'classnames'
import { Badge } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { isLand } from '../../../modules/nft/utils'
import { AssetImage } from '../../AssetImage'
import { Network } from '../Network'
import { Description } from '../Description'
import { Owner } from '../Owner'
import Price from '../Price'
import Expiration from '../Expiration'
import { Actions } from '../Actions'
import { BidList } from '../BidList'
import { JumpIn } from '../JumpIn'
import { ProximityHighlights } from '../ProximityHighlights'
import BaseDetail from '../BaseDetail'
import { TransactionHistory } from '../TransactionHistory'
import { RentalHistory } from '../RentalHistory'
import { SaleRentActionBox } from '../SaleRentActionBox'
import { Props } from './EstateDetail.types'
import { ParcelCoordinates } from './ParcelCoordinates'
import './EstateDetail.css'

const EstateDetail = ({ nft, order, rental, isRentalsEnabled }: Props) => {
  const estate = nft.data.estate!
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
      showDetails={isRentalsEnabled && isLand(nft)}
      assetImage={
        <>
          <AssetImage
            className={classNames(estate.size === 0 && 'dissolved')}
            asset={nft}
            isDraggable
            withNavigation
            hasPopup
          />
          {estate.size === 0 && (
            <div className="dissolved-wrapper">
              <div className="dissolved-notice">
                {t('estate_detail.dissolved')}
              </div>
            </div>
          )}
        </>
      }
      actions={
        <>
          {isRentalsEnabled ? (
            <SaleRentActionBox
              isRentalsEnabled={isRentalsEnabled}
              order={order}
              nft={nft}
              rental={rental}
            />
          ) : null}
        </>
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
          {!isRentalsEnabled ? <Owner asset={nft} /> : null}
          <ProximityHighlights nft={nft} />
        </>
      }
      box={
        <>
          <Price asset={nft} />
          <Network asset={nft} />
          {estate.size > 0 && <Actions nft={nft} />}
          <Expiration />
        </>
      }
      below={
        <>
          <BidList nft={nft} />
          {estate.size > 0 && <ParcelCoordinates estateId={nft.tokenId} />}
          <TransactionHistory asset={nft} />
          {isRentalsEnabled ? <RentalHistory asset={nft} /> : null}
        </>
      }
    />
  )
}

export default React.memo(EstateDetail)
