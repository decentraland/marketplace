import React from 'react'
import { Container, Header } from 'decentraland-ui'

import { getNFTName } from '../../../modules/nft/utils'
import { PageHeader } from '../../PageHeader'
import { NFTImage } from '../../NFTImage'
import { Row } from '../../Layout/Row'
import { Column } from '../../Layout/Column'
import { Title } from '../Title'
import { Owner } from '../Owner'
import { OrderDetails } from '../OrderDetails'
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
        <Row>
          <Column align="left" grow={true}>
            <OrderDetails nft={nft} />
          </Column>
          <Column align="right">
            <Actions nft={nft} />
          </Column>
        </Row>
      </Container>
    </>
  )
}

export default React.memo(PictureFrameDetail)
