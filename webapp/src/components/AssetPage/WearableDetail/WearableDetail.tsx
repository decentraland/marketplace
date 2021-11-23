import React from 'react'
import { Container, Header, Stats } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Rarity } from '@dcl/schemas'
import { getAssetName } from '../../../modules/asset/utils'
import { AssetType } from '../../../modules/asset/types'
import { PageHeader } from '../../PageHeader'
import { AssetImage } from '../../AssetImage'
import { Row } from '../../Layout/Row'
import { Column } from '../../Layout/Column'
import { Title } from '../Title'
import { WearableRarity } from '../WearableRarity'
import { WearableHighlights } from '../WearableHighlights'
import { Owner } from '../Owner'
import { Description } from '../Description'
import { Network } from '../Network'
import { OrderDetails } from '../OrderDetails'
import { Actions } from '../Actions'
import { Bids } from '../Bids'
import { TransactionHistory } from '../TransactionHistory'
import { WearableCollection } from '../WearableCollection'
import { Props } from './WearableDetail.types'
import './WearableDetail.css'

const WearableDetail = (props: Props) => {
  const { nft } = props
  const wearable = nft.data.wearable!

  return (
    <div className="WearableDetail">
      <PageHeader>
        <AssetImage asset={nft} isDraggable />
      </PageHeader>
      <Container>
        <Title
          left={
            <Header size="large">
              <div className="text">
                {getAssetName(nft)}
                <WearableRarity type={AssetType.NFT} wearable={wearable} />
              </div>
            </Header>
          }
          right={<Owner asset={nft} />}
        />
        <Description text={wearable.description} />
        <Row>
          <Column align="left" grow={true}>
            <Network asset={nft} />
            <OrderDetails nft={nft} />
          </Column>
          <Column align="right">
            <Actions nft={nft} />
          </Column>
        </Row>
        <Row>
          <WearableCollection type={AssetType.NFT} asset={nft} />
          {nft.issuedId ? (
            <Stats title={t('global.issue_number')}>
              <Header>
                {Number(nft.issuedId).toLocaleString()}
                <span className="issue-number">
                  /{Rarity.getMaxSupply(wearable.rarity).toLocaleString()}
                </span>
              </Header>
            </Stats>
          ) : null}
        </Row>
        <WearableHighlights type={AssetType.ITEM} wearable={wearable} />
        <Bids nft={nft} />
        <TransactionHistory nft={nft} />
      </Container>
    </div>
  )
}

export default React.memo(WearableDetail)
