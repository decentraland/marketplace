import React from 'react'
import { Container, Header } from 'decentraland-ui'
import { T, t } from 'decentraland-dapps/dist/modules/translation/utils'

import { buildExplorerUrl } from '../../../modules/nft/parcel/utils'
import { NFTCategory } from '../../../modules/nft/types'
import { getNFTName } from '../../../modules/nft/utils'
import { locations } from '../../../modules/routing/locations'
import { PageHeader } from '../../PageHeader'
import { NFTImage } from '../../NFTImage'
import { Row } from '../../Layout/Row'
import { Column } from '../../Layout/Column'
import { Title } from '../Title'
import { Owner } from '../Owner'
import { Badge } from '../Badge'
import { Description } from '../Description'
import { OrderDetails } from '../OrderDetails'
import { Actions } from '../Actions'
import { ProximityHighlights } from '../ProximityHighlights'
import { TransactionHistory } from '../TransactionHistory'
import { Bids } from '../Bids'
import { Props } from './ParcelDetail.types'
import './ParcelDetail.css'
import { Link } from 'react-router-dom'

const ParcelDetail = (props: Props) => {
  const { nft } = props
  const parcel = nft.data.parcel!
  const { x, y } = parcel
  const isPartOfEstate = nft.category === NFTCategory.PARCEL && parcel.estate

  return (
    <>
      <PageHeader>
        <NFTImage
          nft={nft}
          isDraggable={true}
          withNavigation={true}
          hasPopup={true}
        />
      </PageHeader>
      <Container className="ParcelDetail">
        <Title
          className="parcel-detail-title"
          leftClassName="left-title"
          left={
            <Header size="large">
              <div className="text">
                {getNFTName(nft)}
                <Badge color="#37333d">
                  <i className="pin" />
                  {x},{y}
                </Badge>
                <Badge color="#ff2d55" className="jump-in-badge">
                  <a
                    href={buildExplorerUrl(x, y)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t('nft_page.jump')}&nbsp;{t('nft_page.in')}
                    <i className="jump-in-icon" />
                  </a>
                </Badge>
              </div>
            </Header>
          }
          rightClassName="right-title"
          right={
            isPartOfEstate ? (
              <div className="estate-information">
                <T
                  id="nft_page.part_of_estate"
                  values={{
                    estate_name: (
                      <Link
                        to={locations.nft(nft.owner, parcel.estate!.tokenId)}
                      >
                        <span title={parcel.estate!.name}>
                          {parcel.estate!.name}
                        </span>
                      </Link>
                    )
                  }}
                />
              </div>
            ) : (
              <Owner nft={nft} />
            )
          }
        />
        <Description text={parcel.data?.description} />
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
