import React from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Container, Header } from 'decentraland-ui'
import { getNFTName } from '../../../modules/nft/utils'
import { PageHeader } from '../../PageHeader'
import { NFTImage } from '../../NFTImage'
import { Title } from '../Title'
import { Owner } from '../Owner'
import { Badge } from '../Badge'
import { Order } from '../Order'
import { TransactionHistory } from '../../TransactionHistory'
import { Props } from './ENSDetail.types'

const ENSDetail = (props: Props) => {
  const { nft } = props
  return (
    <>
      <PageHeader>
        <NFTImage nft={nft} />
      </PageHeader>
      <Container className="ENSDetail">
        <Title
          left={
            <>
              <Header size="large">{getNFTName(nft)}</Header>
              <Badge color="#37333d">{t('global.ens')}</Badge>
            </>
          }
          right={<Owner nft={nft} />}
        />
        <Order nft={nft} />
        <TransactionHistory nft={nft} />
      </Container>
    </>
  )
}

export default React.memo(ENSDetail)
