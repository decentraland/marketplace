import { Link } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import { Sale } from '@dcl/schemas'
import {
  Header,
  Table,
  Mobile,
  NotMobile,
  Pagination,
  Loader,
  Row
} from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Profile } from 'decentraland-dapps/dist/containers'
import dateFnsFormat from 'date-fns/format'

import { Mana } from '../../Mana'
import { locations } from '../../../modules/routing/locations'
import { saleAPI } from '../../../modules/vendor/decentraland'
import { formatDistanceToNow } from '../../../lib/date'
import { formatWeiMANA } from '../../../lib/mana'
import { Props } from './TransactionHistory.types'
import './TransactionHistory.css'

const INPUT_FORMAT = 'PPP'
const WEEK_IN_MILLISECONDS = 7 * 24 * 60 * 60 * 1000
const ROWS_PER_PAGE = 12

const formatEventDate = (updatedAt: number) => {
  const newUpdatedAt = new Date(updatedAt)
  return Date.now() - newUpdatedAt.getTime() > WEEK_IN_MILLISECONDS
    ? dateFnsFormat(newUpdatedAt, INPUT_FORMAT)
    : formatDistanceToNow(newUpdatedAt, { addSuffix: true })
}

const formatDateTitle = (updatedAt: number) => {
  return new Date(updatedAt).toLocaleString()
}

const TransactionHistory = (props: Props) => {
  const { asset } = props

  const [sales, setSales] = useState([] as Sale[])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  // We're doing this outside of redux to avoid having to store all orders when we only care about the last open one
  useEffect(() => {
    if (asset) {
      setIsLoading(true)
      let params: Record<string, string | number> = {
        contractAddress: asset.contractAddress,
        first: ROWS_PER_PAGE,
        skip: (page - 1) * ROWS_PER_PAGE
      }
      if ('tokenId' in asset) {
        params.tokenId = asset.tokenId
      } else {
        params.itemId = asset.itemId
      }
      saleAPI
        .fetch(params)
        .then(response => {
          setSales(response.data)
          setTotalPages((response.total / ROWS_PER_PAGE) | 0)
        })
        .finally(() => setIsLoading(false))
        .catch(error => {
          console.error(error)
        })
    }
  }, [asset, setIsLoading, setSales, page])

  const network = asset ? asset.network : undefined

  return (
    <div className="TransactionHistory">
      {isLoading && sales.length === 0 ? null : sales.length > 0 ? (
        <>
          <Header sub>{t('transaction_history.title')}</Header>
          <NotMobile>
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
                    {t('transaction_history.type')}
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    {t('transaction_history.when')}
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    {t('transaction_history.price')}
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body className={isLoading ? 'is-loading' : ''}>
                {sales.map(sale => (
                  <Table.Row key={sale.id}>
                    <Table.Cell>
                      <Link to={locations.account(sale.seller)}>
                        <Profile address={sale.seller} />
                      </Link>
                    </Table.Cell>
                    <Table.Cell>
                      <Link to={locations.account(sale.buyer)}>
                        <Profile address={sale.buyer} />
                      </Link>
                    </Table.Cell>
                    <Table.Cell>{t(`global.${sale.type}`)}</Table.Cell>
                    <Table.Cell title={formatDateTitle(sale.timestamp)}>
                      {formatEventDate(sale.timestamp)}
                    </Table.Cell>
                    <Table.Cell>
                      <Mana network={network} inline>
                        {formatWeiMANA(sale.price)}
                      </Mana>
                    </Table.Cell>
                  </Table.Row>
                ))}
                {isLoading ? <Loader active /> : null}
              </Table.Body>
            </Table>
          </NotMobile>
          <Mobile>
            <div className="mobile-tx-history">
              {sales.map(sale => (
                <div className="mobile-tx-history-row" key={sale.id}>
                  <div className="price">
                    <Mana network={network} inline>
                      {formatWeiMANA(sale.price)}
                    </Mana>
                  </div>
                  <div className="when">{formatEventDate(sale.timestamp)}</div>
                </div>
              ))}
            </div>
          </Mobile>
          {totalPages > 1 ? (
            <Row center>
              <Pagination
                activePage={page}
                totalPages={totalPages}
                onPageChange={(_event, props) => setPage(+props.activePage!)}
                firstItem={null}
                lastItem={null}
              />
            </Row>
          ) : null}
        </>
      ) : null}
    </div>
  )
}

export default React.memo(TransactionHistory)
