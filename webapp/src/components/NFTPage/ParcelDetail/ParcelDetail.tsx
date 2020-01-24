import React, { useState, useEffect, useMemo } from 'react'
import { Container, Header } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { landAPI } from '../../../lib/api/land'
import { getNFTName } from '../../../modules/nft/utils'
import { Atlas } from '../../Atlas'
import { Title } from '../Title'
import { Owner } from '../Owner'
import { Badge } from '../Badge'
import { Description } from '../Description'
import { Order } from '../Order'
import { Highlights } from '../Highlights'
import { Props, ParcelData } from './ParcelDetail.types'
import { Highlight } from '../Highlight'
import './ParcelDetail.css'

const getDistance = (distance: number) =>
  distance === 0 ? t('adjacent') : t('detail.distance', { distance })

const ParcelDetail = (props: Props) => {
  const { nft } = props
  const { x, y } = nft.parcel!

  const selection = useMemo(() => [{ x, y }], [x, y])

  const [parcel, setParcel] = useState<ParcelData | null>(null)
  useEffect(() => {
    if (!parcel || parcel.x !== +x || parcel.y !== +y) {
      landAPI
        .fetchParcel(x, y)
        .then(setParcel)
        .catch()
    }
  }, [parcel, setParcel, x, y])

  const proximity = parcel?.tags.proximity

  return (
    <>
      <div style={{ height: 420 }}>
        <Atlas x={+x} y={+y} isDraggable selection={selection} />
      </div>
      <Container className="ParcelDetail">
        <Title
          left={
            <>
              <Header size="large">{getNFTName(nft)}</Header>
              <Badge color="#37333d">
                <i className="pin" />
                {nft.parcel!.x},{nft.parcel!.y}
              </Badge>
            </>
          }
          right={<Owner nft={nft} />}
        />
        <Description text={nft.parcel!.data?.description} />
        <Order nft={nft} />
        {proximity ? (
          <Highlights>
            {proximity?.plaza ? (
              <Highlight
                icon={<div className="plaza" />}
                name={t('detail.plaza')}
                description={getDistance(proximity?.plaza.distance)}
              />
            ) : null}
            {proximity?.road ? (
              <Highlight
                icon={<div className="road" />}
                name={t('detail.road')}
                description={getDistance(proximity?.road.distance)}
              />
            ) : null}
            {proximity?.district ? (
              <Highlight
                icon={<div className="district" />}
                name={t('detail.district')}
                description={getDistance(proximity?.district.distance)}
              />
            ) : null}
          </Highlights>
        ) : null}
      </Container>
    </>
  )
}

export default React.memo(ParcelDetail)
