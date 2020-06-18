import React from 'react'
import { Container, Header } from 'decentraland-ui'

import { getNFTName } from '../../../modules/nft/utils'
import { PageHeader } from '../../PageHeader'
import { NFTImage } from '../../NFTImage'
import { Title } from '../Title'
import { Owner } from '../Owner'
import { Layout } from '../Layout'
import { Order } from '../Order'
import { Actions } from '../Actions'
import { Props } from './PictureFrameDetail.types'

const PictureFrameDetail = (props: Props) => {
  const { nft } = props

  return (
    <>
      <PageHeader>
        <NFTImage nft={nft} />
      </PageHeader>
      <Container className="PictureFrameDetail">
        <Title
          left={<Header size="large">{getNFTName(nft)}</Header>}
          right={<Owner nft={nft} />}
        />
        <Layout left={<Order nft={nft} />} right={<Actions nft={nft} />} />
      </Container>
    </>
  )
}

export default React.memo(PictureFrameDetail)
