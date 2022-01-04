import React from 'react'
import classNames from 'classnames'
import { Badge } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Network } from '../Network'
import { Description } from '../Description'
import { Props } from './EstateDetail.types'
import { Owner } from '../Owner'
import Price from '../Price'
import Expiration from '../Expiration'
import { Actions } from '../Actions'
import { BidList } from '../BidList'
import { TransactionHistory } from '../TransactionHistory'
import { JumpIn } from '../JumpIn'
import { ProximityHighlights } from '../ProximityHighlights'
import { ParcelCoordinates } from './ParcelCoordinates'
import BaseDetail from '../BaseDetail'
import { AssetImage } from '../../AssetImage'
import './EstateDetail.css'

const EstateDetail = ({ nft }: Props) => {
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
          {estate.size > 0 && <Actions nft={nft} />}
          <Expiration />
        </>
      }
      below={
        <>
          <BidList nft={nft} />
          {estate.size > 0 && <ParcelCoordinates estateId={nft.tokenId} />}
          <TransactionHistory asset={nft} />
        </>
      }
    />
  )
}

export default React.memo(EstateDetail)
