import React from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Badge } from 'decentraland-ui'
import { AssetImage } from '../../AssetImage'
import { Network } from '../../Network'
import Price from '../../Price'
import { Actions } from '../Actions'
import BaseDetail from '../BaseDetail'
import { BidList } from '../BidList'
import Expiration from '../Expiration'
import { Owner } from '../Owner'
import { TransactionHistory } from '../TransactionHistory'
import { Props } from './ENSDetail.types'

const ENSDetail = ({ nft }: Props) => (
  <BaseDetail
    asset={nft}
    assetImage={<AssetImage asset={nft} />}
    isOnSale={!!nft.activeOrderId}
    badges={<Badge color="#37333d">{t('global.ens')}</Badge>}
    left={<Owner asset={nft} />}
    box={
      <>
        <Price asset={nft} />
        <Network asset={nft} />
        <Actions nft={nft} />
        <Expiration />
      </>
    }
    below={
      <>
        <BidList nft={nft} />
        <TransactionHistory asset={nft} />
      </>
    }
  />
)

export default React.memo(ENSDetail)
