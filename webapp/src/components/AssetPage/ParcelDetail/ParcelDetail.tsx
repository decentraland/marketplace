import React from 'react'
import { NFTCategory } from '@dcl/schemas'
import { T } from 'decentraland-dapps/dist/modules/translation/utils'
import { Link } from 'react-router-dom'
import { locations } from '../../../modules/routing/locations'
import { isLand } from '../../../modules/nft/utils'
import { Coordinate } from '../../Coordinate'
import { AssetImage } from '../../AssetImage'
import { Network } from '../../Network'
import { Description } from '../Description'
import Price from '../../Price'
import Expiration from '../Expiration'
import { Actions } from '../Actions'
import { BidList } from '../BidList'
import { JumpIn } from '../JumpIn'
import { TransactionHistory } from '../TransactionHistory'
import { RentalHistory } from '../RentalHistory'
import { ProximityHighlights } from '../ProximityHighlights'
import BaseDetail from '../BaseDetail'
import { SaleRentActionBox } from '../SaleRentActionBox'
import { Owner } from '../Owner'
import { Props } from './ParcelDetail.types'
import styles from './ParcelDetail.module.css'

const ParcelDetail = ({ nft, order, rental }: Props) => {
  const parcel = nft.data.parcel!
  const { x, y } = parcel
  const isPartOfEstate = nft.category === NFTCategory.PARCEL && parcel.estate

  return (
    <BaseDetail
      asset={nft}
      rental={rental ?? undefined}
      assetImage={
        <AssetImage
          asset={nft}
          isDraggable
          withNavigation
          hasPopup
          showUpdatedDateWarning
        />
      }
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
      box={
        <>
          {isPartOfEstate && (
            <div className={styles.estateInfo}>
              <T
                id="asset_page.part_of_estate"
                values={{
                  estate_name: (
                    <Link
                      title={parcel.estate!.name}
                      to={locations.nft(nft.owner, parcel.estate!.tokenId)}
                    >
                      {parcel.estate!.name}
                    </Link>
                  )
                }}
              />
            </div>
          )}
          <Price asset={nft} />
          <Network asset={nft} />
          <Actions nft={nft} />
          <Expiration />
        </>
      }
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
