import React from 'react'
import { Container, Header } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { buildExplorerUrl } from '../../../modules/nft/parcel/utils'
import { getNFTName } from '../../../modules/nft/utils'
import { PageHeader } from '../../PageHeader'
import { NFTImage } from '../../NFTImage'
import { Title } from '../Title'
import { Owner } from '../Owner'
import { Badge } from '../Badge'
import { Description } from '../Description'
import { Order } from '../Order'
import { ProximityHighlights } from '../ProximityHighlights'
import { TransactionHistory } from '../TransactionHistory'
import { Bids } from '../Bids'
import { Props } from './ParcelDetail.types'
import './ParcelDetail.css'

const ParcelDetail = (props: Props) => {
  const { nft } = props
  const { x, y } = nft.parcel!

  return (
    <>
      <PageHeader>
        <NFTImage nft={nft} isDraggable={true} withNavigation={true} />
      </PageHeader>
      <Container className="ParcelDetail">
        <Title
          left={
            <>
              <Header size="large">{getNFTName(nft)}</Header>
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
                  {t('global.jump_in')}&nbsp;
                  <i className="jump-in-icon" />
                </a>
              </Badge>
            </>
          }
          right={<Owner nft={nft} />}
        />
        <Description text={nft.parcel!.data?.description} />
        <Order nft={nft} />
        <ProximityHighlights nft={nft} />
        <Bids nft={nft} />
        <TransactionHistory nft={nft} />
      </Container>
    </>
  )
}

export default React.memo(ParcelDetail)
