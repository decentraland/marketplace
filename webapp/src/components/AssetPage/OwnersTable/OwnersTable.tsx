import React, { useEffect, useState } from 'react'
import { Table, Loader, Icon, Button, Row, Pagination } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'

import { nftAPI } from '../../../modules/vendor/decentraland'
import { LinkedProfile } from '../../LinkedProfile'
import ListedBadge from '../../ListedBadge'
import {
  OwnersFilters,
  OwnersResponse,
  OwnersSortBy,
  Props
} from './OwnersTable.types'
import styles from './OwnersTable.module.css'

const ROWS_PER_PAGE = 6

const OwnersTable = (props: Props) => {
  const { asset, sort_by = OwnersSortBy.ISSUED_ID } = props

  const [owners, setOwners] = useState([] as Array<OwnersResponse>)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  // We're doing this outside of redux to avoid having to store all orders when we only care about the first ROWS_PER_PAGE
  useEffect(() => {
    if (asset) {
      setIsLoading(true)
      let params: OwnersFilters = {
        contractAddress: asset.contractAddress!,
        itemId: asset.itemId!,
        first: ROWS_PER_PAGE,
        skip: (page - 1) * ROWS_PER_PAGE,
        sort_by: sort_by
      }
      nftAPI
        .getOwners(params)
        .then(response => {
          setTotal(response.total)
          setOwners(response.data)
          setTotalPages(Math.ceil(response.total / ROWS_PER_PAGE) | 0)
        })
        .finally(() => setIsLoading(false))
        .catch(error => {
          console.error(error)
        })
    }
  }, [asset, setIsLoading, setOwners, page, sort_by])

  return (
    <div className={styles.OwnersTable}>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Table basic="very">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell className={styles.headerMargin}>
                  {t('owners_table.owner')}
                </Table.HeaderCell>
                <Table.HeaderCell>
                  {t('owners_table.issue_number')}
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body className={isLoading ? 'is-loading' : ''}>
              {owners?.map(owner => (
                <Table.Row key={owner.issuedId}>
                  <Table.Cell>
                    <LinkedProfile
                      className={styles.linkedProfileRow}
                      address={owner.ownerId}
                    />
                  </Table.Cell>
                  {console.log(owner.orderStatus)}
                  <Table.Cell>
                    <div className={styles.issuedIdContainer}>
                      <div className={styles.row}>
                        <span>
                          <span className={styles.issuedId}>
                            {owner.issuedId}
                          </span>
                          /{total}
                        </span>
                        {owner.orderStatus === 'open' &&
                        +new Date(`${owner.orderExpiresAt} 00:00:00`) <
                          Date.now() ? (
                          <ListedBadge className={styles.badge} />
                        ) : null}
                      </div>
                      <Button basic>
                        <Icon name="arrow right" className={styles.gotToNFT} />
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
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
      )}
    </div>
  )
}

export default React.memo(OwnersTable)
