import React, { useState } from 'react'
import { Button } from 'decentraland-ui'
import { NFTCategory } from '@dcl/schemas'
import { T } from 'decentraland-dapps/dist/modules/translation/utils'
import { Link } from 'react-router-dom'
import { Network } from '../Network'
import { Description } from '../Description'
import { Props } from './ParcelDetail.types'
import { Owner } from '../Owner'
import Price from '../Price'
import Expiration from '../Expiration'
import { Actions } from '../Actions'
import { BidList } from '../BidList'
import { TransactionHistory } from '../TransactionHistory'
import { Coordinate } from '../../Coordinate'
import { JumpIn } from '../JumpIn'
import { ProximityHighlights } from '../ProximityHighlights'
import { CreateRentalModal } from '../../CreateRentalModal'
import { locations } from '../../../modules/routing/locations'
import BaseDetail from '../BaseDetail'
import { AssetImage } from '../../AssetImage'
import styles from './ParcelDetail.module.css'

const ParcelDetail = ({ nft, isRentalsEnabled }: Props) => {
  const parcel = nft.data.parcel!
  const { x, y } = parcel
  const isPartOfEstate = nft.category === NFTCategory.PARCEL && parcel.estate

  const [showCreateRentalModal, setShowCreateRentalModal] = useState(false)

  return (
    <BaseDetail
      asset={nft}
      assetImage={
        <AssetImage asset={nft} isDraggable withNavigation hasPopup />
      }
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
          {isRentalsEnabled ? (
            <>
              <Button onClick={() => setShowCreateRentalModal(true)}>
                Create Rental
              </Button>
              <CreateRentalModal
                nft={nft}
                open={showCreateRentalModal}
                onCancel={() => setShowCreateRentalModal(false)}
              />
            </>
          ) : null}
        </>
      }
    />
  )
}

export default React.memo(ParcelDetail)
