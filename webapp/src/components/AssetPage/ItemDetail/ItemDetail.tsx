import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Container, Header, Mana, Stats } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'

import { getAssetName, isOwnedBy } from '../../../modules/nft/utils'
import { ResultType } from '../../../modules/routing/types'
import { formatMANA } from '../../../lib/mana'
import { locations } from '../../../modules/routing/locations'
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
  const { item, wallet } = props
  const wearable = item.data.wearable!
  const canBuy = isOwnedBy(item, wallet) && !!item.price

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
            {item.price ? (
              <Stats title={t('asset_page.price')}>
                <Mana network={item.network} withTooltip>
                  {formatMANA(item.price)}
                </Mana>
              </Stats>
            ) : null}
          </Column>
          <Column align="right">
            {canBuy ? (
              <Button
                as={Link}
                to={locations.buy(
                  ResultType.ITEM,
                  item.contractAddress,
                  item.itemId
                )}
                primary
              >
                {t('asset_page.actions.buy')}
              </Button>
            ) : null}
          </Column>
        </Row>
        <WearableHighlights type={ResultType.ITEM} wearable={wearable} />
      </Container>
    </div>
  )
}

export default React.memo(ItemDetail)
