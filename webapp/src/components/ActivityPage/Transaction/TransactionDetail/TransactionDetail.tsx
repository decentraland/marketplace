import React from 'react'
import { Link } from 'react-router-dom'
import { Loader, Mana, Icon } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import {
  isPending,
  getTransactionHref
} from 'decentraland-dapps/dist/modules/transaction/utils'
import {
  TransactionStatus,
  Transaction
} from 'decentraland-dapps/dist/modules/transaction/types'
import { formatDistanceToNow } from '../../../../lib/date'
import { locations } from '../../../../modules/routing/locations'
import { NFTImage } from '../../../NFTImage'
import { Row } from '../../../Layout/Row'
import { Column } from '../../../Layout/Column'
import { Props } from './TransactionDetail.types'
import './TransactionDetail.css'

const getHref = (tx: Transaction) => {
  if (tx.status === null) {
    return
  }
  return getTransactionHref({ txHash: tx.replacedBy || tx.hash })
}

const TransactionDetail = (props: Props) => {
  const { nft, text, tx } = props
  return (
    <Row className="TransactionDetail">
      <Column align="left" grow={true}>
        <div className="image">
          {nft === null ? (
            <Loader active size="small" />
          ) : nft ? (
            <Link to={locations.nft(nft.contractAddress, nft.tokenId)}>
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
      </Column>
      <Column align="right">
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
      </Column>
    </Row>
  )
}

export default React.memo(TransactionDetail)
