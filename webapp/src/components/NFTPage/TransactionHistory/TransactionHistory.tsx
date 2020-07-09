import React, { useState, useEffect } from 'react'
import { Header, Table, Mana, Responsive } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import dateFnsFormat from 'date-fns/format'

import { VendorFactory } from '../../../modules/vendor'
import { Bid } from '../../../modules/bid/types'
import { Order, OrderStatus } from '../../../modules/order/types'
import { formatDistanceToNow } from '../../../lib/date'
import { formatMANA } from '../../../lib/mana'
import { Address } from '../../Address'
import { Props, HistoryEvent, UnionOrderBid } from './TransactionHistory.types'
import './TransactionHistory.css'

const INPUT_FORMAT = 'PPP'
const WEEK_IN_MILLISECONDS = 7 * 24 * 60 * 60 * 1000

const formatEventDate = (updatedAt: string) => {
  const newUpdatedAt = new Date(+updatedAt * 1000)
  return Date.now() - newUpdatedAt.getTime() > WEEK_IN_MILLISECONDS
    ? dateFnsFormat(newUpdatedAt, INPUT_FORMAT)
    : formatDistanceToNow(newUpdatedAt, { addSuffix: true })
}

const formatDateTitle = (updatedAt: string) => {
  return new Date(+updatedAt * 1000).toLocaleString()
}

const sortByUpdatedAt = (a: { updatedAt: string }, b: { updatedAt: string }) =>
  a.updatedAt > b.updatedAt ? -1 : 1

const toEvent = (orderOrBid: UnionOrderBid): HistoryEvent => ({
  from: orderOrBid.owner! || orderOrBid.seller!,
  to: orderOrBid.buyer! || orderOrBid.bidder!,
  price: orderOrBid.price!,
  updatedAt: orderOrBid.updatedAt!
})

const TransactionHistory = (props: Props) => {
  const { nft } = props

  const [orders, setOrders] = useState([] as Order[])
  const [bids, setBids] = useState([] as Bid[])
  const [isLoading, setIsLoading] = useState(false)

  // We're doing this outside of redux to avoid having to store all orders when we only care about the last open one
  useEffect(() => {
    if (nft) {
      const { orderService, bidService } = VendorFactory.build(nft.vendor)

      setIsLoading(true)
      Promise.all([
        orderService.fetchByNFT(nft.id),
        bidService ? bidService.fetchByNFT(nft.id, OrderStatus.SOLD) : []
      ])
        .then(([orders, bids]) => {
          setOrders(orders)
          setBids(bids)
        })
        .finally(() => setIsLoading(false))
        .catch(error => {
          console.error(error)
        })
    }
  }, [nft, setIsLoading, setOrders, setBids])

  const events: HistoryEvent[] = [...orders, ...bids]
    .sort(sortByUpdatedAt)
    .map(toEvent)

  return (
    <div className="TransactionHistory">
      {isLoading ? null : events.length > 0 ? (
        <>
          <Header sub>{t('transaction_history.title')}</Header>
          <Responsive minWidth={Responsive.onlyComputer.minWidth}>
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
                      <Address address={event.to} />
                    </Table.Cell>
                    <Table.Cell title={formatDateTitle(event.updatedAt)}>
                      {formatEventDate(event.updatedAt)}
                    </Table.Cell>
                    <Table.Cell>
                      <Mana inline>{formatMANA(event.price)}</Mana>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </Responsive>
          <Responsive maxWidth={Responsive.onlyTablet.maxWidth}>
            <div className="mobile-tx-history">
              {events.map((event, index) => (
                <div className="mobile-tx-history-row" key={index}>
                  <div className="price">
                    <Mana inline>{formatMANA(event.price)}</Mana>
                  </div>
                  <div className="when">{formatEventDate(event.updatedAt)}</div>
                </div>
              ))}
            </div>
          </Responsive>
        </>
      ) : null}
    </div>
  )
}

export default React.memo(TransactionHistory)
