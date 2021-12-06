import React from 'react'
import { Badge } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Network } from '../Network'
import { Props } from './ENSDetail.types'
import { Owner } from '../Owner'
import Price from '../Price'
import Expiration from '../Expiration'
import { Actions } from '../Actions'
import { Bids } from '../Bids'
import { TransactionHistory } from '../TransactionHistory'
import BaseDetail from '../BaseDetail'
import { AssetImage } from '../../AssetImage'

const ENSDetail = ({ nft }: Props) => (
  <BaseDetail
    asset={nft}
    assetImage={<AssetImage asset={nft} showMonospace />}
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
        <Bids nft={nft} />
        <TransactionHistory nft={nft} />
      </>
    }
  />
)

export default React.memo(ENSDetail)
