import React, { useState, useEffect, useMemo } from 'react'
import { Container, Header } from 'decentraland-ui'
import { land } from '../../../lib/api/land'
import { Atlas } from '../../Atlas'
import { Title } from '../Title'
import { Owner } from '../Owner'
import { Badge } from '../Badge'
import { Description } from '../Description'
import { Order } from '../Order'
import { Highlights } from '../Highlights'
import { Props, ParcelData } from './ParcelDetail.types'
import './ParcelDetail.css'
import { Highlight } from '../Highlight'

const getDistance = (distance: number) =>
  distance === 0
    ? 'Adjacent'
    : `${distance} parcel${distance === 1 ? '' : 's'} away`

const ParcelDetail = (props: Props) => {
  const { nft } = props
  const { x, y } = nft.parcel!

  const selection = useMemo(() => [{ x, y }], [nft])

  const [parcel, setParcel] = useState<ParcelData | null>(null)
  useEffect(() => {
    if (!parcel || parcel.x !== +x || parcel.y !== +y) {
      land
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
              <Header size="large">{nft.name || 'Parcel'}</Header>
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
                name="Plaza"
                description={getDistance(proximity?.plaza.distance)}
              />
            ) : null}
            {proximity?.road ? (
              <Highlight
                icon={<div className="road" />}
                name="Road"
                description={getDistance(proximity?.road.distance)}
              />
            ) : null}
            {proximity?.district ? (
              <Highlight
                icon={<div className="district" />}
                name="District"
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
