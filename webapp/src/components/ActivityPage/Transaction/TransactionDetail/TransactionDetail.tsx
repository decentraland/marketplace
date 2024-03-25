import React from 'react'
import { Link } from 'react-router-dom'
import { Network } from '@dcl/schemas'
import { getChainConfiguration } from 'decentraland-dapps/dist/lib/chainConfiguration'
import { TransactionStatus } from 'decentraland-dapps/dist/modules/transaction/types'
import { isPending } from 'decentraland-dapps/dist/modules/transaction/utils'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Loader, Icon } from 'decentraland-ui'
import { formatDistanceToNow } from '../../../../lib/date'
import { getAssetUrl } from '../../../../modules/asset/utils'
import { AssetImage } from '../../../AssetImage'
import { Column } from '../../../Layout/Column'
import { Row } from '../../../Layout/Row'
import { Mana } from '../../../Mana'
import { Props } from './TransactionDetail.types'
import './TransactionDetail.css'

const TransactionDetail = (props: Props) => {
  const { asset, text, tx } = props

  return (
    <Row className="TransactionDetail">
      <Column align="left" grow={true}>
        <div className="image">
          {asset === null ? (
            <Loader active size="small" />
          ) : asset ? (
            <Link to={getAssetUrl(asset)}>
              <AssetImage asset={asset} isSmall />
            </Link>
          ) : (
            <Mana showTooltip network={tx.chainId ? getChainConfiguration(tx.chainId).network : Network.ETHEREUM} />
          )}
        </div>
        <div className="text">
          <div className="description">{text}</div>
          <div className="timestamp">{formatDistanceToNow(tx.timestamp)}.</div>
        </div>
      </Column>
      <Column align="right">
        <a href={tx.url} className={tx.status ? 'status ' + tx.status : 'status'} target="_blank" rel="noopener noreferrer">
          <div className="description">{tx.status || t('global.loading')}</div>
          {isPending(tx.status) ? (
            <div className="spinner">
              <Loader active size="mini" />
            </div>
          ) : null}
          {tx.status === TransactionStatus.REVERTED ? <Icon name="warning sign" /> : null}
          {tx.status === TransactionStatus.CONFIRMED || tx.status === TransactionStatus.REPLACED ? <Icon name="check" /> : null}
        </a>
      </Column>
    </Row>
  )
}

export default React.memo(TransactionDetail)
