import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ListingStatus, Network } from '@dcl/schemas'
import { Table, Loader, Row, Pagination, Icon, Mana } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Order, OrderFilters, OrderSortBy } from '@dcl/schemas/dist/dapps/order'
import { nftAPI, orderAPI } from '../../../modules/vendor/decentraland'
import { locations } from '../../../modules/routing/locations'
import { formatWeiMANA } from '../../../lib/mana'
import { formatDistanceToNow, getDateAndMonthName } from '../../../lib/date'
import { LinkedProfile } from '../../LinkedProfile'
import { Props } from './ListingsTable.types'
import styles from './ListingsTable.module.css'

export const ROWS_PER_PAGE = 6
const INITIAL_PAGE = 1

const ListingsTable = (props: Props) => {
  const { asset, sortBy = OrderSortBy.CHEAPEST } = props

  const [orders, setOrders] = useState<Order[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(INITIAL_PAGE)
  const [totalPages, setTotalPages] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(false)

  // We're doing this outside of redux to avoid having to store all orders when we only care about the first ROWS_PER_PAGE
  useEffect(() => {
    if (asset) {
      setIsLoading(true)

      let params: OrderFilters = {
        contractAddress: asset.contractAddress,
        first: ROWS_PER_PAGE,
        skip: (page - 1) * ROWS_PER_PAGE,
        status: ListingStatus.OPEN
      }

      if (asset.network === Network.MATIC && asset.itemId) {
        params.itemId = asset.itemId
      } else if (asset.network === Network.ETHEREUM) {
        params.nftName = asset.name
      }

      asset.itemId &&
        nftAPI
          .getOwners({
            contractAddress: asset.contractAddress,
            itemId: asset.itemId,
            first: 1,
            skip: 0
          })
          .then(response => {
            setTotal(response.total)
          })
          .finally(() => setIsLoading(false))
          .catch(error => {
            console.error(error)
          })

      orderAPI
        .fetchOrders(params, sortBy)
        .then(response => {
          setOrders(response.data)
          setTotalPages(Math.ceil(response.total / ROWS_PER_PAGE) || 0)
        })
        .finally(() => setIsLoading(false))
        .catch(error => {
          console.error(error)
        })
    }
  }, [asset, setIsLoading, setOrders, sortBy, page])

  return (
    <div className={styles.ListingsTable}>
      {isLoading ? (
        <div className={styles.emptyTable}>
          <Loader active data-testid="loader" />
        </div>
      ) : orders.length === 0 ? (
        <div className={styles.emptyTable}>
          <span>{t('listings_table.there_are_no_listings')}</span>
        </div>
      ) : (
        <>
          <Table basic="very" data-testid="listings-table">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell className={styles.headerMargin}>
                  {t('listings_table.owner')}
                </Table.HeaderCell>
                <Table.HeaderCell>
                  {t('listings_table.published_date')}
                </Table.HeaderCell>
                <Table.HeaderCell>
                  {t('listings_table.expiration_date')}
                </Table.HeaderCell>
                <Table.HeaderCell>
                  {t('listings_table.issue_number')}
                </Table.HeaderCell>
                <Table.HeaderCell>{t('listings_table.price')}</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body className={isLoading ? 'is-loading' : ''}>
              {orders?.map(order => (
                <Table.Row key={order.id}>
                  <Table.Cell>
                    <LinkedProfile
                      className={styles.linkedProfileRow}
                      address={order.owner}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    {getDateAndMonthName(order.createdAt)}
                  </Table.Cell>
                  <Table.Cell>
                    {formatDistanceToNow(+order.expiresAt, {
                      addSuffix: true
                    })}
                  </Table.Cell>
                  <Table.Cell>
                    <div className={styles.issuedIdContainer}>
                      <div className={styles.row}>
                        <span>
                          <span className={styles.issuedId}>
                            {order.tokenId}
                          </span>
                          / {total}
                        </span>
                      </div>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <div className={styles.manaField}>
                      <Mana className="manaField" network={asset?.network}>
                        {formatWeiMANA(order.price)}
                      </Mana>
                      {asset?.contractAddress && order.tokenId && (
                        <Link
                          to={locations.nft(
                            asset.contractAddress,
                            order.tokenId
                          )}
                        >
                          <Icon name="arrow right" className={styles.goToNFT} />
                        </Link>
                      )}
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          {totalPages && totalPages > 1 ? (
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
      )}
    </div>
  )
}

export default React.memo(ListingsTable)
