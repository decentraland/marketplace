import React, { useCallback } from 'react'
import { Container, Header, Popup } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import {
  RARITY_COLOR,
  BodyShape,
  WearableGender
} from '../../../modules/nft/wearable/types'
import { getNFTName } from '../../../modules/nft/utils'
import { isUnisex, isGender } from '../../../modules/nft/wearable/utils'
import { locations } from '../../../modules/routing/locations'
import { getSearchWearableSection } from '../../../modules/routing/search'
import { Section } from '../../../modules/vendor/decentraland/routing/types'
import { PageHeader } from '../../PageHeader'
import { NFTImage } from '../../NFTImage'
import { Row } from '../../Layout/Row'
import { Column } from '../../Layout/Column'
import { Title } from '../Title'
import { Owner } from '../Owner'
import { Description } from '../Description'
import { OrderDetails } from '../OrderDetails'
import { Actions } from '../Actions'
import { Highlight } from '../Highlight'
import { Highlights } from '../Highlights'
import { Bids } from '../Bids'
import { TransactionHistory } from '../TransactionHistory'
import { Props } from './WearableDetail.types'
import './WearableDetail.css'

const WearableDetail = (props: Props) => {
  const { nft, onNavigate } = props
  const wearable = nft.data.wearable!

  const handleCategoryClick = useCallback(() => {
    const category = wearable.category
    const section = getSearchWearableSection(category)
    if (!section) {
      throw new Error(`Invalid wearable category ${category}`)
    }
    onNavigate(locations.browse({ section }))
  }, [wearable, onNavigate])

  const handleGenderClick = useCallback(() => {
    onNavigate(
      locations.browse({
        section: Section.WEARABLES,
        wearableGenders: isGender(wearable, BodyShape.MALE)
          ? [WearableGender.MALE]
          : [WearableGender.FEMALE]
      })
    )
  }, [wearable, onNavigate])

  const handleRarityClick = useCallback(() => {
    onNavigate(
      locations.browse({
        section: Section.WEARABLES,
        wearableRarities: [wearable.rarity]
      })
    )
  }, [wearable, onNavigate])

  const handleUnisexClick = useCallback(() => {
    onNavigate(
      locations.browse({
        section: Section.WEARABLES,
        wearableGenders: [WearableGender.MALE, WearableGender.FEMALE]
      })
    )
  }, [onNavigate])

  return (
    <div className="WearableDetail">
      <PageHeader>
        <NFTImage nft={nft} />
      </PageHeader>
      <Container>
        <Title
          left={
            <Header size="large">
              <div className="text">
                {getNFTName(nft)}
                <Popup
                  position="top center"
                  content={t(`wearable.rarity_tooltip.${wearable.rarity}`)}
                  trigger={
                    <div
                      className="rarity"
                      style={{
                        backgroundColor: RARITY_COLOR[wearable.rarity]
                      }}
                      onClick={handleRarityClick}
                    >
                      {t(`wearable.rarity.${wearable.rarity}`)}
                    </div>
                  }
                />
              </div>
            </Header>
          }
          right={<Owner nft={nft} />}
        />
        <Description text={wearable.description} />
        <Row>
          <Column align="left" grow={true}>
            <OrderDetails nft={nft} />
          </Column>
          <Column align="right">
            <Actions nft={nft} />
          </Column>
        </Row>
        <Highlights>
          <Highlight
            icon={<div className={wearable.category} />}
            name={t(`wearable.category.${wearable.category}`)}
            onClick={handleCategoryClick}
          />
          {isUnisex(wearable) ? (
            <Highlight
              icon={<div className="Unisex" />}
              name={t('wearable.body_shape.unisex')}
              onClick={handleUnisexClick}
            />
          ) : (
            <Highlight
              icon={<div className={wearable.bodyShapes[0]} />}
              name={
                isGender(wearable, BodyShape.MALE)
                  ? t('wearable.body_shape.male')
                  : t('wearable.body_shape.female')
              }
              onClick={handleGenderClick}
            />
          )}
        </Highlights>
        <Bids nft={nft} />
        <TransactionHistory nft={nft} />
      </Container>
    </div>
  )
}

export default React.memo(WearableDetail)
