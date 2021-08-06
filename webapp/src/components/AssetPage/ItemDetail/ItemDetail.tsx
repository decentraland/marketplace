import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Container, Header, Mana, Stats } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'

import { formatMANA } from '../../../lib/mana'
import { locations } from '../../../modules/routing/locations'
import { getAssetName, isOwnedBy } from '../../../modules/asset/utils'
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
import { AssetType } from '../../../modules/asset/types'

const ItemDetail = (props: Props) => {
  const { item, wallet } = props
  const wearable = item.data.wearable!
  const canBuy = item.isOnSale && item.available > 0 && !isOwnedBy(item, wallet)

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
                <WearableRarity type={AssetType.ITEM} wearable={wearable} />
              </div>
            </Header>
          }
          right={<Owner asset={item} />}
        />
        <Description text={wearable.description} />
        <Row>
          <Column align="left" grow={true}>
            {item.isOnSale ? (
              <>
                <Stats title={t('asset_page.price')}>
                  <Mana network={item.network} withTooltip>
                    {formatMANA(item.price)}
                  </Mana>
                </Stats>
                <Stats title={t('asset_page.available')}>
                  {item.available > 0
                    ? item.available.toLocaleString()
                    : t('asset_page.sold_out')}
                </Stats>
              </>
            ) : null}
          </Column>
          <Column align="right">
            {canBuy ? (
              <Button
                as={Link}
                to={locations.buy(
                  AssetType.ITEM,
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
        <WearableHighlights type={AssetType.ITEM} wearable={wearable} />
      </Container>
    </div>
  )
}

export default React.memo(ItemDetail)
