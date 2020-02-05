import React, { useMemo } from 'react'
import { Container, Header } from 'decentraland-ui'
import { getNFTName } from '../../../modules/nft/utils'
import { getSelection, getCenter } from '../../../modules/nft/estate/utils'
import { Atlas } from '../../Atlas'
import { PageHeader } from '../../PageHeader'
import { Title } from '../Title'
import { Owner } from '../Owner'
import { Badge } from '../Badge'
import { Description } from '../Description'
import { Order } from '../Order'
import { ProximityHighlights } from '../ProximityHighlights'
import { TransactionHistory } from '../../TransactionHistory'
import { Props } from './EstateDetail.types'
import './EstateDetail.css'

const EstateDetail = (props: Props) => {
  const { nft } = props
  const selection = useMemo(() => getSelection(nft), [nft])
  const [x, y] = getCenter(selection)
  return (
    <>
      <PageHeader>
        <Atlas
          x={x}
          y={y}
          isDraggable
          selection={selection}
          withNavigation
          isEstate
        />
      </PageHeader>
      <Container className="EstateDetail">
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
        <ProximityHighlights nft={nft} />
        <TransactionHistory nft={nft} />
      </Container>
    </>
  )
}

export default React.memo(EstateDetail)
