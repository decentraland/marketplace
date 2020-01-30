import React from 'react'
import { Container, Header } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import {
  RARITY_COLOR,
  BodyShape,
  RARITY_COLOR_LIGHT
} from '../../../modules/nft/wearable/types'
import { getNFTName } from '../../../modules/nft/utils'
import { PageHeader } from '../../PageHeader'
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

  const backgroundImage = `radial-gradient(${
    RARITY_COLOR_LIGHT[nft.wearable!.rarity]
  }, ${RARITY_COLOR[nft.wearable!.rarity]})`

  return (
    <div className="WearableDetail">
      <PageHeader style={{ backgroundImage }}>
        <img alt={getNFTName(nft)} src={nft.image} />
      </PageHeader>
      <Container>
        <Title
          left={
            <>
              <Header size="large">{getNFTName(nft)}</Header>
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
              key={shape}
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
    </div>
  )
}

export default React.memo(WearableDetail)
