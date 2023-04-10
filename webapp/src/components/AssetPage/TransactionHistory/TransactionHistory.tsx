import React, { useState, useEffect } from 'react'
import { Item, Sale } from '@dcl/schemas'
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
import dateFnsFormat from 'date-fns/format'

import { Mana } from '../../Mana'
import { saleAPI } from '../../../modules/vendor/decentraland'
import { formatDistanceToNow } from '../../../lib/date'
import { formatWeiMANA } from '../../../lib/mana'
import { isNFT } from '../../../modules/asset/utils'
import { NFT } from '../../../modules/nft/types'
import { LinkedProfile } from '../../LinkedProfile'
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
  const isAssetNull = asset === null
  const isAssetNFT = asset && isNFT(asset)
  const assetContractAddress = asset?.contractAddress
  const assetTokenId = asset ? (asset as NFT).tokenId : '0'
  const assetItemId = asset ? (asset as Item).itemId : '0'

  // We're doing this outside of redux to avoid having to store all orders when we only care about the last open one
  useEffect(() => {
    if (!isAssetNull) {
      setIsLoading(true)
      let params: Record<string, string | number> = {
        contractAddress: assetContractAddress!,
        first: ROWS_PER_PAGE,
        skip: (page - 1) * ROWS_PER_PAGE
      }
      if (isAssetNFT) {
        params.tokenId = assetTokenId
      } else {
        params.itemId = assetItemId
      }
      saleAPI
        .fetch(params)
        .then(response => {
          setSales(response.data)
          setTotalPages(Math.ceil(response.total / ROWS_PER_PAGE) | 0)
        })
        .finally(() => setIsLoading(false))
        .catch(error => {
          console.error(error)
        })
    }
  }, [
    assetContractAddress,
    assetTokenId,
    assetItemId,
    setIsLoading,
    setSales,
    page,
    isAssetNull,
    isAssetNFT
  ])

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
                      <LinkedProfile address={sale.seller} />
                    </Table.Cell>
                    <Table.Cell>
                      <LinkedProfile address={sale.buyer} />
                    </Table.Cell>
                    <Table.Cell>{t(`global.${sale.type}`)}</Table.Cell>
                    <Table.Cell title={formatDateTitle(sale.timestamp)}>
                      {formatEventDate(sale.timestamp)}
                    </Table.Cell>
                    <Table.Cell>
                      <Mana showTooltip network={network} inline>
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
                    <Mana showTooltip network={network} inline>
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
