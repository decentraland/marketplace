import React, { useMemo } from 'react'
import { Container, Header } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { getDistanceText } from '../../../modules/proximity/utils'
import { getNFTName } from '../../../modules/nft/utils'
import { getId } from '../../../modules/nft/parcel/utils'
import { Atlas } from '../../Atlas'
import { Title } from '../Title'
import { Owner } from '../Owner'
import { Badge } from '../Badge'
import { Description } from '../Description'
import { Order } from '../Order'
import { Highlights } from '../Highlights'
import { Props } from './ParcelDetail.types'
import { Highlight } from '../Highlight'
import './ParcelDetail.css'

const ParcelDetail = (props: Props) => {
  const { nft, proximity } = props
  const { x, y } = nft.parcel!
  const id = getId(x, y)
  const tags = proximity[id]
  const selection = useMemo(() => [{ x, y }], [x, y])

  return (
    <>
      <div style={{ height: 420 }}>
        <Atlas x={+x} y={+y} isDraggable selection={selection} withNavigation />
      </div>
      <Container className="ParcelDetail">
        <Title
          left={
            <>
              <Header size="large">{getNFTName(nft)}</Header>
              <Badge color="#37333d">
                <i className="pin" />
                {id}
              </Badge>
            </>
          }
          right={<Owner nft={nft} />}
        />
        <Description text={nft.parcel!.data?.description} />
        <Order nft={nft} />
        {tags ? (
          <Highlights>
            {tags?.plaza !== undefined ? (
              <Highlight
                icon={<div className="plaza" />}
                name={t('detail.plaza')}
                description={getDistanceText(tags?.plaza)}
              />
            ) : null}
            {tags?.road !== undefined ? (
              <Highlight
                icon={<div className="road" />}
                name={t('detail.road')}
                description={getDistanceText(tags?.road)}
              />
            ) : null}
            {tags?.district !== undefined ? (
              <Highlight
                icon={<div className="district" />}
                name={t('detail.district')}
                description={getDistanceText(tags?.district)}
              />
            ) : null}
          </Highlights>
        ) : null}
      </Container>
    </>
  )
}

export default React.memo(ParcelDetail)
