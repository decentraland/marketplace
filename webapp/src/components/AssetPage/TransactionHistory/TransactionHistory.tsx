import { Link } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import { Bid, ListingStatus, Order } from '@dcl/schemas'
import { Header, Table, Responsive } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Profile } from 'decentraland-dapps/dist/containers'
import dateFnsFormat from 'date-fns/format'

import { Mana } from '../../Mana'
import { locations } from '../../../modules/routing/locations'
import { VendorFactory } from '../../../modules/vendor'
import { formatDistanceToNow } from '../../../lib/date'
import { formatMANA } from '../../../lib/mana'
import { Props, HistoryEvent } from './TransactionHistory.types'
import './TransactionHistory.css'

const INPUT_FORMAT = 'PPP'
const WEEK_IN_MILLISECONDS = 7 * 24 * 60 * 60 * 1000

const formatEventDate = (updatedAt: number) => {
  const newUpdatedAt = new Date(updatedAt)
  return Date.now() - newUpdatedAt.getTime() > WEEK_IN_MILLISECONDS
    ? dateFnsFormat(newUpdatedAt, INPUT_FORMAT)
    : formatDistanceToNow(newUpdatedAt, { addSuffix: true })
}

const formatDateTitle = (updatedAt: number) => {
  return new Date(updatedAt).toLocaleString()
}

const sortByUpdatedAt = (a: { updatedAt: number }, b: { updatedAt: number }) =>
  a.updatedAt > b.updatedAt ? -1 : 1

const toEvent = (orderOrBid: any): HistoryEvent => ({
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
        orderService.fetchByNFT(nft, ListingStatus.SOLD),
        bidService ? bidService.fetchByNFT(nft, ListingStatus.SOLD) : []
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

  const network = nft ? nft.network : undefined

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
                      <Link to={locations.account(event.from)}>
                        <Profile address={event.from} />
                      </Link>
                    </Table.Cell>
                    <Table.Cell>
                      <Link to={locations.account(event.to)}>
                        <Profile address={event.to} />
                      </Link>
                    </Table.Cell>
                    <Table.Cell title={formatDateTitle(event.updatedAt)}>
                      {formatEventDate(event.updatedAt)}
                    </Table.Cell>
                    <Table.Cell>
                      <Mana network={network} inline>
                        {formatMANA(event.price)}
                      </Mana>
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
                    <Mana network={network} inline>
                      {formatMANA(event.price)}
                    </Mana>
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
