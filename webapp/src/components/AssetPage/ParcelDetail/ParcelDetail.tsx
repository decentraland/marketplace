import React from 'react'
import { Container } from 'decentraland-ui'
import { AssetImage } from '../../AssetImage'
import { PageHeader } from '../../PageHeader'
import { Network } from '../Network'
import { Description } from '../Description'
import { Props } from './ParcelDetail.types'
import Title from '../V2/Title'
import { Box } from '../../AssetBrowse/Box'
import { Owner } from '../V2/Owner'
import ListedBadge from '../../ListedBadge'
import Price from '../V2/Price'
import Expiration from '../V2/Expiration'
import { Actions } from '../Actions'
import { Bids } from '../Bids'
import { TransactionHistory } from '../TransactionHistory'
import { Coordinate } from '../../Coordinate'
import { JumpIn } from '../JumpIn'
import { ProximityHighlights } from '../ProximityHighlights'
import { Link } from 'react-router-dom'
import { T } from 'decentraland-dapps/dist/modules/translation/utils'
import { locations } from '../../../modules/routing/locations'
import { NFTCategory } from '@dcl/schemas'
import styles from './ParcelDetail.module.css'

const ParcelDetail = ({ nft }: Props) => {
  const parcel = nft.data.parcel!
  const { x, y } = parcel
  const isPartOfEstate = nft.category === NFTCategory.PARCEL && parcel.estate

  return (
    <div className={styles.detail}>
      <PageHeader>
        <AssetImage asset={nft} isDraggable withNavigation hasPopup />
        {!!nft.activeOrderId && <ListedBadge className={styles.listedBadge} />}
      </PageHeader>
      <Container>
        <div className={styles.info}>
          <div className={styles.left}>
            <div>
              <Title asset={nft} />
              <div className={styles.badges}>
                <Coordinate x={Number(x)} y={Number(y)} />
                <JumpIn x={Number(x)} y={Number(y)} />
              </div>
            </div>
            <Description text={parcel.description} />
            <Owner asset={nft} />
            <ProximityHighlights nft={nft} />
          </div>
          <div className={styles.right}>
            <Box className={styles.box}>
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
            </Box>
          </div>
        </div>
        <Bids nft={nft} />
        <TransactionHistory nft={nft} />
      </Container>
    </div>
  )
}

export default React.memo(ParcelDetail)
