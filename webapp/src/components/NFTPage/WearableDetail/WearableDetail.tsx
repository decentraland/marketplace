import React from 'react'
import { Container, Header } from 'decentraland-ui'
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

const capitalize = (text: string) => text[0].toUpperCase() + text.slice(1)
const humanize = (text: string) =>
  text
    .split('_')
    .map(capitalize)
    .join(' ')

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
        <img src={nft.image} />
      </div>
      <Container className="WearableDetail">
        <Title
          left={
            <>
              <Header size="large">{nft.name || 'Estate'}</Header>
              <Badge color={RARITY_COLOR[nft.wearable!.rarity]}>
                {nft.wearable!.rarity}
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
            name={humanize(nft.wearable!.category)}
          />
          {nft.wearable!.bodyShapes.map(shape => (
            <Highlight
              icon={<div className={shape} />}
              name={shape === BodyShape.MALE ? 'Male' : 'Female'}
            />
          ))}
        </Highlights>
      </Container>
    </>
  )
}

export default React.memo(WearableDetail)
