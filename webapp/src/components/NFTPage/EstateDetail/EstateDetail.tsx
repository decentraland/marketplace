import React from 'react'
import { Container, Header } from 'decentraland-ui'
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
import { Props } from './EstateDetail.types'
import './EstateDetail.css'

const EstateDetail = (props: Props) => {
  const { nft } = props
  return (
    <>
      <PageHeader>
        <NFTImage nft={nft} isDraggable={true} withNavigation={true} />
      </PageHeader>
      <Container className="EstateDetail">
        <Title
          left={
            <>
              <Header size="large">{getNFTName(nft)}</Header>
              <Badge color="#37333d">
                {nft.estate!.size.toLocaleString()} LAND
              </Badge>
            </>
          }
          right={<Owner nft={nft} />}
        />
        <Description text={nft.estate!.data?.description} />
        <Order nft={nft} />
        <ProximityHighlights nft={nft} />
        <Bids nft={nft} />
        <TransactionHistory nft={nft} />
      </Container>
    </>
  )
}

export default React.memo(EstateDetail)
