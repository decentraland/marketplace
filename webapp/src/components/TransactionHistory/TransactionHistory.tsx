import React, { useState, useEffect } from 'react'
import { Header, Table, Loader, Mana } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import dateFnsFormat from 'date-fns/format'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

import { Order } from '../../modules/order/types'
import { formatMANA } from '../../lib/mana'
import { nftAPI } from '../../lib/api/nft'
import { Address } from '../Address'
import { Props } from './TransactionHistory.types'
import './TransactionHistory.css'

const INPUT_FORMAT = 'PPP'
const WEEK_IN_MILLISECONDS = 7 * 24 * 60 * 60 * 1000

const formatOrderDate = (order: Order) => {
  const updatedAt = new Date(+order.updatedAt * 1000)
  return Date.now() - updatedAt.getTime() > WEEK_IN_MILLISECONDS
    ? dateFnsFormat(updatedAt, INPUT_FORMAT)
    : formatDistanceToNow(updatedAt, { addSuffix: true })
}

const formatDateTitle = (order: Order) => {
  return new Date(+order.updatedAt * 1000).toLocaleString()
}

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
  }, [nft, setIsLoading, setOrders])

  return (
    <div className="TransactionHistory">
      {isLoading ? (
        <Loader active size="massive" />
      ) : orders.length > 0 ? (
        <>
          <Header sub>{t('transaction_history.title')}</Header>
          <Table basic="very">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>
                  {t('transaction_history.from')}
                </Table.HeaderCell>
                <Table.HeaderCell>
                  {t('transaction_history.to')}
                </Table.HeaderCell>
                <Table.HeaderCell>
                  {t('transaction_history.when')}
                </Table.HeaderCell>
                <Table.HeaderCell>
                  {t('transaction_history.price')}
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {orders.map((order, index) => (
                <Table.Row key={index}>
                  <Table.Cell>
                    <Address address={order.owner} />
                  </Table.Cell>
                  <Table.Cell>
                    <Address address={order.buyer} />
                  </Table.Cell>
                  <Table.Cell title={formatDateTitle(order)}>
                    {formatOrderDate(order)}
                  </Table.Cell>
                  <Table.Cell>
                    <Mana inline>{formatMANA(order.price)}</Mana>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </>
      ) : null}
    </div>
  )
}

export default React.memo(TransactionHistory)
