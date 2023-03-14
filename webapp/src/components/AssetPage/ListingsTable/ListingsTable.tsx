import React, { useState } from 'react'
import { Table, Loader, Row, Pagination, Icon, Mana } from 'decentraland-ui'
import { ChainId, ListingStatus, Network } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Order } from '@dcl/schemas/dist/dapps/order'
import { Link } from 'react-router-dom'
// import { fromUnixTime } from 'date-fns'

import { locations } from '../../../modules/routing/locations'
import { formatWeiMANA } from '../../../lib/mana'
import { formatDistanceToNow, getDateAndMonthName } from '../../../lib/date'
import { LinkedProfile } from '../../LinkedProfile'
import { SortByOptions, Props } from './ListingsTable.types'
import styles from './ListingsTable.module.css'

// const ROWS_PER_PAGE = 6
const INITIAL_PAGE = 1

const ListingsTable = (props: Props) => {
  const { asset, sortBy = SortByOptions.CHEAPEST } = props

  false && console.log(asset, sortBy)

  const [orders] = useState<Order[]>([
    {
      id: '0x01489387f6c06b3185bdbb34c8398091be33214a97b7cd18266ba634ef3bce5f',
      marketplaceAddress: '1',
      contractAddress: '1',
      tokenId: '13',
      owner: '0xa87d168717538e86d71ac48baccaeb84162de602',
      buyer: null,
      price: '1',
      status: ListingStatus.OPEN,
      expiresAt: 1653609600000,
      createdAt: 1669997473000,
      updatedAt: 1,
      network: Network.MATIC,
      chainId: ChainId.MATIC_MUMBAI
    },
    {
      id: '2',
      marketplaceAddress: '2',
      contractAddress: '2',
      tokenId: '2',
      owner: '2',
      buyer: null,
      price: '2',
      status: ListingStatus.OPEN,
      expiresAt: 1653609600000,
      createdAt: 1676556397000,
      updatedAt: 2,
      network: Network.MATIC,
      chainId: ChainId.MATIC_MUMBAI
    },
    {
      id: '3',
      marketplaceAddress: '3',
      contractAddress: '3',
      tokenId: '3',
      owner: '3',
      buyer: null,
      price: '3',
      status: ListingStatus.OPEN,
      expiresAt: 1653609600000,
      createdAt: 1676556397000,
      updatedAt: 3,
      network: Network.MATIC,
      chainId: ChainId.MATIC_MUMBAI
    }
  ])
  // const [total, setTotal] = useState(0)
  const [page, setPage] = useState(INITIAL_PAGE)
  const [totalPages] = useState<number>(0)
  const [isLoading] = useState(false)

  // We're doing this outside of redux to avoid having to store all orders when we only care about the first ROWS_PER_PAGE
  // useEffect(() => {
  //   if (asset && asset.itemId) {
  //     setIsLoading(true)
  //     let params: OwnersFilters = {
  //       contractAddress: asset.contractAddress,
  //       itemId: asset.itemId,
  //       first: ROWS_PER_PAGE,
  //       skip: (page - 1) * ROWS_PER_PAGE,
  //       sortBy: OwnersSortBy.ISSUED_ID
  //       // orderDirection
  //     }
  //     nftAPI
  //       .getOwners(params)
  //       .then(response => {
  //         setTotal(response.total)
  //         setOwners(response.data)
  //         setTotalPages(Math.ceil(response.total / ROWS_PER_PAGE) | 0)
  //       })
  //       .finally(() => setIsLoading(false))
  //       .catch(error => {
  //         console.error(error)
  //       })
  //   }
  // }, [asset, setIsLoading, setOwners, page])

  return (
    <div className={styles.ListingsTable}>
      {isLoading ? (
        <div className={styles.loadingStatus}>
          <Loader active />
        </div>
      ) : (
        <>
          <Table basic="very">
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
                        </span>
                      </div>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <Mana className="manaField">
                        {formatWeiMANA(order.price)}
                      </Mana>
                      <Link
                        to={locations.nft(
                          asset?.contractAddress,
                          order?.tokenId
                        )}
                      >
                        <Icon name="arrow right" className={styles.goToNFT} />
                      </Link>
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
