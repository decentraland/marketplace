import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Table, Mana } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import dateFnsFormat from 'date-fns/format'

import { locations } from '../../modules/routing/locations'
import { Order } from '../../modules/order/types'
import { formatMANA } from '../../lib/mana'
import { nftAPI } from '../../lib/api/nft'
import { shortenAddress } from '../../modules/wallet/utils'
import { Owner } from '../NFTPage/Owner'

import { Props } from './TransactionHistory.types'

import './TransactionHistory.css'

const INPUT_FORMAT = 'PPP'

const TransactionHistory = (props: Props) => {
  const { nft } = props

  const [orders, setOrders] = useState([] as Order[])
  const [isLoading, setIsLoading] = useState(false)

  // We're doing this outside of redux to avoid having to store all orders when we only care about the last open one
  useEffect(() => {
    if (nft) {
      setIsLoading(true)
      nftAPI.fetchOrders(nft.id).then(orders => {
        setIsLoading(false)
        setOrders(orders)
      })
    }
  }, [setIsLoading, setOrders])

  if (isLoading) {
    return null
  }

  return (
    <Table basic="very">
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>{t('detail.history.from')}</Table.HeaderCell>
          <Table.HeaderCell>{t('detail.history.to')}</Table.HeaderCell>
          <Table.HeaderCell>{t('detail.history.when')}</Table.HeaderCell>
          <Table.HeaderCell>{t('detail.price')}</Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {orders.map((order, index) => (
          <Table.Row key={index}>
            <Table.Cell>
              <TransactionAddress nft={nft} address={order.owner} />
            </Table.Cell>
            <Table.Cell>
              <TransactionAddress nft={nft} address={order.buyer} />
            </Table.Cell>
            <Table.Cell>
              {dateFnsFormat(+order.createdAt * 1000, INPUT_FORMAT)}
            </Table.Cell>
            <Table.Cell>
              <Mana inline>{formatMANA(order.price)}</Mana>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  )
}

export default React.memo(TransactionHistory)

const TransactionAddress = (props: any) => {
  const { address, nft } = props

  return (
    <div className="address-wrapper" title={address}>
      <Owner nft={nft} />
      <Link to={locations.account(address)}>
        &nbsp;
        <span className="short-address">{shortenAddress(address)}</span>
      </Link>
    </div>
  )
}
