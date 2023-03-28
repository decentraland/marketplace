import React, { useEffect, useState } from 'react'
import { ListingStatus } from '@dcl/schemas'
import { Table, Loader, Icon, Row, Pagination, Button } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Link } from 'react-router-dom'
import { locations } from '../../../modules/routing/locations'
import {
  nftAPI,
  OwnersResponse,
  OwnersFilters,
  OwnersSortBy
} from '../../../modules/vendor/decentraland'
import { LinkedProfile } from '../../LinkedProfile'
import ListedBadge from '../../ListedBadge'
import { OrderDirection, Props } from './OwnersTable.types'
import styles from './OwnersTable.module.css'

export const ROWS_PER_PAGE = 6
const INITIAL_PAGE = 1

const OwnersTable = (props: Props) => {
  const { asset, orderDirection = OrderDirection.ASC } = props

  const [owners, setOwners] = useState<OwnersResponse[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(INITIAL_PAGE)
  const [totalPages, setTotalPages] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(false)

  // We're doing this outside of redux to avoid having to store all orders when we only care about the first ROWS_PER_PAGE
  useEffect(() => {
    if (asset && asset.itemId) {
      setIsLoading(true)
      let params: OwnersFilters = {
        contractAddress: asset.contractAddress,
        itemId: asset.itemId,
        first: ROWS_PER_PAGE,
        skip: (page - 1) * ROWS_PER_PAGE,
        sortBy: OwnersSortBy.ISSUED_ID,
        orderDirection
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
  }, [asset, setIsLoading, setOwners, page, orderDirection])

  return (
    <div className={styles.OwnersTable}>
      {isLoading ? (
        <div className={styles.emptyTable}>
          <Loader active data-testid="loader" />
        </div>
      ) : owners.length === 0 ? (
        <div className={styles.emptyTable}>
          <span>
            {t('owners_table.there_are_no_owners')}
            <Button
              basic
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              className={styles.emptyTableActionButton}
            >
              {t('owners_table.become_the_first_one')}
            </Button>
          </span>
        </div>
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
            <Table.Body>
              {owners?.map(owner => (
                <Table.Row key={owner.issuedId}>
                  <Table.Cell>
                    <LinkedProfile
                      className={styles.linkedProfileRow}
                      address={owner.ownerId}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <div className={styles.issuedIdContainer}>
                      <div className={styles.row}>
                        <span>
                          <span className={styles.issuedId}>
                            {owner.issuedId}
                          </span>
                          /{total}
                        </span>
                        {owner.orderStatus === ListingStatus.OPEN &&
                        owner.orderExpiresAt &&
                        Number(owner.orderExpiresAt) >= Date.now() ? (
                          <ListedBadge className={styles.badge} />
                        ) : null}
                      </div>
                      {asset?.contractAddress && owner.tokenId && (
                        <Link
                          to={locations.nft(
                            asset.contractAddress,
                            owner.tokenId
                          )}
                        >
                          <Icon
                            name="arrow right"
                            className={styles.gotToNFT}
                          />
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

export default React.memo(OwnersTable)
