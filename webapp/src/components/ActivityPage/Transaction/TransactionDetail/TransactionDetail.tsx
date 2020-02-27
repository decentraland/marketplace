import React from 'react'
import { Link } from 'react-router-dom'
import { Loader, Mana, Icon } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import {
  isPending,
  getEtherscanHref
} from 'decentraland-dapps/dist/modules/transaction/utils'
import {
  TransactionStatus,
  Transaction
} from 'decentraland-dapps/dist/modules/transaction/types'
import { formatDistanceToNow } from '../../../../lib/date'
import { locations } from '../../../../modules/routing/locations'
import { NFTImage } from '../../../NFTImage'
import { Props } from './Transaction.types'
import './TransactionDetail.css'

const getHref = (tx: Transaction) => {
  if (tx.status == null) return
  return getEtherscanHref({ txHash: tx.replacedBy || tx.hash })
}

const TransactionDetail = (props: Props) => {
  const { nft, text, tx } = props
  return (
    <div className="TransactionDetail">
      <div className="left">
        <div className="image">
          {nft === null ? (
            <Loader active size="small" />
          ) : nft ? (
            <Link to={locations.ntf(nft.contractAddress, nft.tokenId)}>
              <NFTImage nft={nft} isSmall />
            </Link>
          ) : (
            <Mana />
          )}
        </div>
        <div className="text">
          <div className="description">{text}</div>
          <div className="timestamp">{formatDistanceToNow(tx.timestamp)}.</div>
        </div>
      </div>
      <div className="right">
        <a
          href={getHref(tx)}
          className={tx.status ? 'status ' + tx.status : 'status'}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="description">{tx.status || t('global.loading')}</div>
          {isPending(tx.status) ? (
            <div className="spinner">
              <Loader active size="mini" />
            </div>
          ) : null}
          {tx.status === TransactionStatus.REVERTED ? (
            <Icon name="warning sign" />
          ) : null}
          {tx.status === TransactionStatus.CONFIRMED ||
          tx.status === TransactionStatus.REPLACED ? (
            <Icon name="check" />
          ) : null}
        </a>
      </div>
    </div>
  )
}

export default React.memo(TransactionDetail)
