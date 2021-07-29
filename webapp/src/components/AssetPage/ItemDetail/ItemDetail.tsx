import React from 'react'
import { Container, Header } from 'decentraland-ui'

import { getAssetName } from '../../../modules/nft/utils'
import { ResultType } from '../../../modules/routing/types'
import { Row } from '../../Layout/Row'
import { Column } from '../../Layout/Column'
import { AssetImage } from '../../AssetImage'
import { PageHeader } from '../../PageHeader'
import { Title } from '../Title'
import { Owner } from '../Owner'
import { Description } from '../Description'
import { WearableRarity } from '../WearableRarity'
import { WearableHighlights } from '../WearableHighlights'
import { Props } from './ItemDetail.types'

const ItemDetail = (props: Props) => {
  const { item } = props
  const wearable = item.data.wearable!

  return (
    <div className="ItemDetail">
      <PageHeader>
        <AssetImage asset={item} />
      </PageHeader>
      <Container>
        <Title
          left={
            <Header size="large">
              <div className="text">
                {getAssetName(item)}
                <WearableRarity type={ResultType.ITEM} wearable={wearable} />
              </div>
            </Header>
          }
          right={<Owner asset={item} />}
        />
        <Description text={wearable.description} />
        <Row>
          <Column align="left" grow={true}>
            Order details here
          </Column>
          <Column align="right">Actions here</Column>
        </Row>
        <WearableHighlights type={ResultType.ITEM} wearable={wearable} />
      </Container>
    </div>
  )
}

export default React.memo(ItemDetail)
