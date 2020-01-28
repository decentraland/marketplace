import React, { useMemo } from 'react'
import { Container, Header } from 'decentraland-ui'
import { getNFTName } from '../../../modules/nft/utils'
import { getSelection, getCenter } from '../../../modules/nft/estate/utils'
import { Atlas } from '../../Atlas'
import { Title } from '../Title'
import { Owner } from '../Owner'
import { Props } from './EstateDetail.types'
import { Badge } from '../Badge'
import { Description } from '../Description'
import { Order } from '../Order'
import './EstateDetail.css'

const EstateDetail = (props: Props) => {
  const { nft } = props
  const selection = useMemo(() => getSelection(nft), [nft])
  const [x, y] = getCenter(selection)
  return (
    <>
      <div style={{ height: 420 }}>
        <Atlas
          x={x}
          y={y}
          isDraggable
          selection={selection}
          withNavigation
          isEstate
        />
      </div>
      <Container>
        <Title
          left={
            <>
              <Header size="large">{getNFTName(nft)}</Header>
              <Badge color="#37333d">
                {nft.estate!.size.toLocaleString()} LAND
              </Badge>
            </>
          }
          right={<Owner nft={nft} />}
        />
        <Description text={nft.estate!.data?.description} />
        <Order nft={nft} />
      </Container>
    </>
  )
}

export default React.memo(EstateDetail)
