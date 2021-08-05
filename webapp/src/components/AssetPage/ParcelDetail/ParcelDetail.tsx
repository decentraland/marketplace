import React from 'react'
import { Link } from 'react-router-dom'
import { NFTCategory } from '@dcl/schemas'
import { Container, Header } from 'decentraland-ui'
import { T } from 'decentraland-dapps/dist/modules/translation/utils'

import { getAssetName } from '../../../modules/asset/utils'
import { locations } from '../../../modules/routing/locations'
import { PageHeader } from '../../PageHeader'
import { AssetImage } from '../../AssetImage'
import { Row } from '../../Layout/Row'
import { Column } from '../../Layout/Column'
import { Coordinate } from '../../Coordinate'
import { Title } from '../Title'
import { Owner } from '../Owner'
import { Description } from '../Description'
import { OrderDetails } from '../OrderDetails'
import { Actions } from '../Actions'
import { ProximityHighlights } from '../ProximityHighlights'
import { TransactionHistory } from '../TransactionHistory'
import { Bids } from '../Bids'
import { JumpIn } from '../JumpIn'
import { Props } from './ParcelDetail.types'
import './ParcelDetail.css'

const ParcelDetail = (props: Props) => {
  const { nft } = props
  const parcel = nft.data.parcel!
  const { x, y } = parcel
  const isPartOfEstate = nft.category === NFTCategory.PARCEL && parcel.estate

  return (
    <>
      <PageHeader>
        <AssetImage
          asset={nft}
          isDraggable={true}
          withNavigation={true}
          hasPopup={true}
        />
      </PageHeader>
      <Container className="ParcelDetail">
        <Title
          leftClassName="left-title"
          left={
            <>
              <Header className="parcel-title-name" size="large">
                {getAssetName(nft)}
              </Header>
              <Coordinate
                className="parcel-title-badge"
                x={Number(x)}
                y={Number(y)}
              />
              <JumpIn
                className="parcel-title-badge parcel-title-jump-in"
                x={Number(x)}
                y={Number(y)}
              />
            </>
          }
          rightClassName="right-title"
          right={
            isPartOfEstate ? (
              <div className="estate-information">
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
            ) : (
              <Owner asset={nft} />
            )
          }
        />
        <Description text={parcel.description} />
        <Row>
          <Column align="left" grow={true}>
            <OrderDetails nft={nft} />
          </Column>
          <Column align="right">
            <Actions nft={nft} />
          </Column>
        </Row>
        <ProximityHighlights nft={nft} />
        <Bids nft={nft} />
        <TransactionHistory nft={nft} />
      </Container>
    </>
  )
}

export default React.memo(ParcelDetail)
