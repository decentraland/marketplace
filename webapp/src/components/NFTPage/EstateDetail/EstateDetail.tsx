import React from 'react'
import { Container, Header } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { buildExplorerUrl } from '../../../modules/nft/parcel/utils'
import { getNFTName } from '../../../modules/nft/utils'
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
import { Props } from './EstateDetail.types'
import './EstateDetail.css'

const EstateDetail = (props: Props) => {
  const { nft } = props
  const estate = nft.data.estate!
  const { x, y } = estate.parcels[0]
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
      <Container className="EstateDetail">
        <Title
          left={
            <Header className="estate-title" size="large">
              <div className="estate-title-name">{getNFTName(nft)}</div>
              <div className="estate-title-land">
                <Badge color="#37333d">
                  {estate.size.toLocaleString()} LAND
                </Badge>
              </div>
              {estate.size > 0 ? (
                <div className="estate-title-jump-in">
                  <Badge className="jump-in-badge" color="#ff2d55">
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
              ) : null}
            </Header>
          }
          right={<Owner nft={nft} />}
        />
        <Description text={estate.data?.description} />
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

export default React.memo(EstateDetail)
