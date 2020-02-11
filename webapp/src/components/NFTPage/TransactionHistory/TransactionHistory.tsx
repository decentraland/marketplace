import React, { useState, useEffect } from 'react'
import { Header, Table, Loader, Mana } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import dateFnsFormat from 'date-fns/format'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

import { Order, OrderStatus } from '../../../modules/order/types'
import { formatMANA } from '../../../lib/mana'
import { nftAPI } from '../../../lib/api/nft'
import { Address } from '../../Address'
import { Props, HistoryEvent } from './TransactionHistory.types'
import './TransactionHistory.css'
import { bidAPI } from '../../../lib/api/bid'
import { Bid } from '../../../modules/bid/types'

const INPUT_FORMAT = 'PPP'
const WEEK_IN_MILLISECONDS = 7 * 24 * 60 * 60 * 1000

const formatOrderDate = (updatedAt: string) => {
  const newUpdatedAt = new Date(+updatedAt * 1000)
  return Date.now() - newUpdatedAt.getTime() > WEEK_IN_MILLISECONDS
    ? dateFnsFormat(newUpdatedAt, INPUT_FORMAT)
    : formatDistanceToNow(newUpdatedAt, { addSuffix: true })
}

const formatDateTitle = (updatedAt: string) => {
  return new Date(+updatedAt * 1000).toLocaleString()
}

const sortByUpdatedAt = (a: Order | Bid, b: Order | Bid) =>
  a.updatedAt > b.updatedAt ? 1 : -1

const toEvent = (orderOrBid: Order | Bid): HistoryEvent => ({
  from: (orderOrBid as Order).owner! || (orderOrBid as Bid).seller!,
  to: (orderOrBid as Order).buyer! || (orderOrBid as Bid).bidder!,
  price: orderOrBid.price,
  updatedAt: orderOrBid.updatedAt
})

const TransactionHistory = (props: Props) => {
  const { nft } = props

  const [orders, setOrders] = useState([] as Order[])
  const [bids, setBids] = useState([] as Bid[])
  const [isLoading, setIsLoading] = useState(false)

  // We're doing this outside of redux to avoid having to store all orders when we only care about the last open one
  useEffect(() => {
    if (nft) {
      setIsLoading(true)
      Promise.all([
        nftAPI.fetchOrders(nft.id),
        bidAPI.fetchByNFT(nft, OrderStatus.SOLD)
      ]).then(([orders, bids]) => {
        setIsLoading(false)
        setOrders(orders)
        setBids(bids)
      })
    }
  }, [nft, setIsLoading, setOrders, setBids])

  const events: HistoryEvent[] = [...orders, ...bids]
    .sort(sortByUpdatedAt)
    .map(toEvent)

  return (
    <div className="TransactionHistory">
      {isLoading ? (
        <Loader active size="massive" />
      ) : events.length > 0 ? (
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
              {events.map((event, index) => (
                <Table.Row key={index}>
                  <Table.Cell>
                    <Address address={event.from} />
                  </Table.Cell>
                  <Table.Cell>
                    <Address address={event.to!} />
                  </Table.Cell>
                  <Table.Cell title={formatDateTitle(event.updatedAt)}>
                    {formatOrderDate(event.updatedAt)}
                  </Table.Cell>
                  <Table.Cell>
                    <Mana inline>{formatMANA(event.price)}</Mana>
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
