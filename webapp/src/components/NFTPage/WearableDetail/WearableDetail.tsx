import React from 'react'
import { Container, Header } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { RARITY_COLOR, BodyShape } from '../../../modules/nft/wearable/types'
import { Title } from '../Title'
import { Owner } from '../Owner'
import { Props } from './WearableDetail.types'
import { Badge } from '../Badge'
import { Description } from '../Description'
import { Order } from '../Order'
import { Highlight } from '../Highlight'
import { Highlights } from '../Highlights'
import './WearableDetail.css'

const WearableDetail = (props: Props) => {
  const { nft } = props

  return (
    <>
      <div
        className="nft-header"
        style={{
          height: 420,
          backgroundColor: RARITY_COLOR[nft.wearable!.rarity]
        }}
      >
        <img alt={nft.name} src={nft.image} />
      </div>
      <Container className="WearableDetail">
        <Title
          left={
            <>
              <Header size="large">{nft.name || t('detail.wearable')}</Header>
              <Badge color={RARITY_COLOR[nft.wearable!.rarity]}>
                {t(`wearable.rarity.${nft.wearable!.rarity}`)}
              </Badge>
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
          />
          {nft.wearable!.bodyShapes.map(shape => (
            <Highlight
              icon={<div className={shape} />}
              name={
                shape === BodyShape.MALE
                  ? t('wearable.body_shape.male')
                  : t('wearable.body_shape.female')
              }
            />
          ))}
        </Highlights>
      </Container>
    </>
  )
}

export default React.memo(WearableDetail)
