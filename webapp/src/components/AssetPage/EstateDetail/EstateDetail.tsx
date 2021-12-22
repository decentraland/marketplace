import React from 'react'
import { Container, Header } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { getAssetName } from '../../../modules/asset/utils'
import { PageHeader } from '../../PageHeader'
import { AssetImage } from '../../AssetImage'
import { Row } from '../../Layout/Row'
import { Column } from '../../Layout/Column'
import { Title } from '../Title'
import { Owner } from '../Owner'
import { Badge } from '../Badge'
import { Description } from '../Description'
import { Network } from '../Network'
import { OrderDetails } from '../OrderDetails'
import { Actions } from '../Actions'
import { ProximityHighlights } from '../ProximityHighlights'
import { TransactionHistory } from '../TransactionHistory'
import { JumpIn } from '../JumpIn'
import { Bids } from '../Bids'
import { Props } from './EstateDetail.types'
import { ParcelCoordinates } from './ParcelCoordinates'
import './EstateDetail.css'

const EstateDetail = (props: Props) => {
  const { nft } = props
  const estate = nft.data.estate!
  let x = 0
  let y = 0

  if (estate.size > 0) {
    x = estate.parcels[0].x
    y = estate.parcels[0].y
  }

  return (
    <>
      <PageHeader>
        <AssetImage
          className={estate.size === 0 ? 'dissolved' : ''}
          asset={nft}
          isDraggable={true}
          withNavigation={true}
          hasPopup={true}
        />
        {estate.size === 0 && (
          <div className="dissolved-wrapper">
            <div className="dissolved-notice">
              {t('estate_detail.dissolved')}
            </div>
          </div>
        )}
      </PageHeader>
      <Container className="EstateDetail">
        <Title
          leftClassName="left-title"
          left={
            <>
              <Header className="estate-title-name" size="large">
                {getAssetName(nft)}
              </Header>
              <Badge className="estate-title-badge" color="#37333d">
                {estate.size.toLocaleString()} LAND
              </Badge>
              {estate.size > 0 ? (
                <JumpIn
                  className="estate-title-badge estate-title-jump-in"
                  x={x}
                  y={y}
                />
              ) : null}
            </>
          }
          rightClassName="right-title"
          right={<Owner asset={nft} />}
        />
        <Description text={estate.description} />
        <Row>
          <Column align="left" grow={true}>
            <Network asset={nft} />
            <OrderDetails nft={nft} />
          </Column>
          <Column align="right">
            <Actions nft={nft} />
          </Column>
        </Row>
        <ProximityHighlights nft={nft} />
        <Bids nft={nft} />
        {estate.size > 0 && <ParcelCoordinates estateId={nft.tokenId} />}
        <TransactionHistory nft={nft} />
      </Container>
    </>
  )
}

export default React.memo(EstateDetail)
