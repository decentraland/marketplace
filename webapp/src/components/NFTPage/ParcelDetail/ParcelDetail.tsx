import React, { useMemo } from 'react'
import { Container, Header } from 'decentraland-ui'
import { getNFTName } from '../../../modules/nft/utils'
import { Atlas } from '../../Atlas'
import { PageHeader } from '../../PageHeader'
import { Title } from '../Title'
import { Owner } from '../Owner'
import { Badge } from '../Badge'
import { Description } from '../Description'
import { Order } from '../Order'
import { ProximityHighlights } from '../ProximityHighlights'
import { Props } from './ParcelDetail.types'
import './ParcelDetail.css'

const ParcelDetail = (props: Props) => {
  const { nft } = props
  const { x, y } = nft.parcel!
  const selection = useMemo(() => [{ x, y }], [x, y])

  return (
    <>
      <PageHeader>
        <Atlas x={+x} y={+y} isDraggable selection={selection} withNavigation />
      </PageHeader>
      <Container className="ParcelDetail">
        <Title
          left={
            <>
              <Header size="large">{getNFTName(nft)}</Header>
              <Badge color="#37333d">
                <i className="pin" />
                {x},{y}
              </Badge>
            </>
          }
          right={<Owner nft={nft} />}
        />
        <Description text={nft.parcel!.data?.description} />
        <Order nft={nft} />
        <ProximityHighlights nft={nft} />
      </Container>
    </>
  )
}

export default React.memo(ParcelDetail)
