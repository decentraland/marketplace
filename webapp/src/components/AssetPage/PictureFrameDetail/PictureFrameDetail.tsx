import React from 'react'
import { Container, Header } from 'decentraland-ui'

import { getAssetName } from '../../../modules/asset/utils'
import { PageHeader } from '../../PageHeader'
import { AssetImage } from '../../AssetImage'
import { Row } from '../../Layout/Row'
import { Column } from '../../Layout/Column'
import { Title } from '../Title'
import { Owner } from '../Owner'
import { Network } from '../Network'
import { OrderDetails } from '../OrderDetails'
import { Actions } from '../Actions'
import { Props } from './PictureFrameDetail.types'

const PictureFrameDetail = (props: Props) => {
  const { nft } = props

  return (
    <>
      <PageHeader>
        <AssetImage asset={nft} />
      </PageHeader>
      <Container className="PictureFrameDetail">
        <Title
          left={<Header size="large">{getAssetName(nft)}</Header>}
          right={<Owner asset={nft} />}
        />
        <Row>
          <Column align="left" grow={true}>
            <Network asset={nft} />
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
