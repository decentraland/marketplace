import React, { useCallback } from 'react'
import { Container, Header, Popup } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { RARITY_COLOR, BodyShape } from '../../../modules/nft/wearable/types'
import { getNFTName } from '../../../modules/nft/utils'
import { locations } from '../../../modules/routing/locations'
import { Section } from '../../../modules/routing/search'
import { PageHeader } from '../../PageHeader'
import { NFTImage } from '../../NFTImage'
import { Title } from '../Title'
import { Owner } from '../Owner'
import { Description } from '../Description'
import { Order } from '../Order'
import { Highlight } from '../Highlight'
import { Highlights } from '../Highlights'
import { TransactionHistory } from '../../TransactionHistory'
import { Props } from './WearableDetail.types'
import './WearableDetail.css'

const WearableDetail = (props: Props) => {
  const { nft, onNavigate } = props

  const handleHighlightClick = useCallback(() => {
    onNavigate(
      locations.browse({
        section: `wearables_${nft.wearable!.category}` as Section
      })
    )
  }, [nft, onNavigate])

  return (
    <div className="WearableDetail">
      <PageHeader>
        <NFTImage nft={nft} />
      </PageHeader>
      <Container>
        <Title
          left={
            <>
              <Header size="large">{getNFTName(nft)}</Header>
              <Popup
                position="top center"
                content={t(`wearable.rarity_tooltip.${nft.wearable!.rarity}`)}
                trigger={
                  <div
                    className="rarity"
                    style={{
                      backgroundColor: RARITY_COLOR[nft.wearable!.rarity]
                    }}
                  >
                    {t(`wearable.rarity.${nft.wearable!.rarity}`)}
                  </div>
                }
              />
            </>
          }
          right={<Owner nft={nft} />}
        />
        <Description text={nft.wearable!.description} />
        <Order nft={nft} />
        <Highlights>
          <Highlight
            icon={<div className={nft.wearable!.category} />}
            name={t(`wearable.category.${nft.wearable!.category}`)}
            onClick={handleHighlightClick}
          />
          {nft.wearable!.bodyShapes.length === 1 ? (
            <Highlight
              icon={<div className={nft.wearable!.bodyShapes[0]} />}
              name={
                nft.wearable!.bodyShapes[0] === BodyShape.MALE
                  ? t('wearable.body_shape.male')
                  : t('wearable.body_shape.female')
              }
            />
          ) : nft.wearable!.bodyShapes.length === 2 ? (
            <Highlight
              icon={<div className="Unisex" />}
              name={t('wearable.body_shape.unisex')}
            />
          ) : null}
        </Highlights>
        <TransactionHistory nft={nft} />
      </Container>
    </div>
  )
}

export default React.memo(WearableDetail)
