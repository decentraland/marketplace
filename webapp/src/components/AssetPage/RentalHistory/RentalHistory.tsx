import React, { useState, useEffect } from 'react'
import { RentalListing, RentalStatus } from '@dcl/schemas'
import {
  Header,
  Table,
  Mobile,
  NotMobile,
  Pagination,
  Loader,
  Row
} from 'decentraland-ui'
import { T, t } from 'decentraland-dapps/dist/modules/translation/utils'
import dateFnsFormat from 'date-fns/format'

import { capitalize } from '../../../lib/text'
import { rentalsAPI } from '../../../modules/vendor/decentraland/rentals/api'
import { formatDistanceToNow } from '../../../lib/date'
import { formatWeiMANA } from '../../../lib/mana'
import { getRentalChosenPeriod } from '../../../modules/rental/utils'
import { Mana } from '../../Mana'
import { LinkedProfile } from '../../LinkedProfile'
import { Props } from './RentalHistory.types'
import styles from './RentalHistory.module.css'

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

const RentalHistory = (props: Props) => {
  const { asset } = props

  const [rentals, setRentals] = useState([] as Array<RentalListing>)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  // We're doing this outside of redux to avoid having to store all orders when we only care about the last open one
  useEffect(() => {
    if (asset) {
      rentalsAPI
        .getRentalListings({
          contractAddresses: [asset.contractAddress],
          tokenId: asset.tokenId,
          status: [RentalStatus.EXECUTED, RentalStatus.CLAIMED],
          limit: ROWS_PER_PAGE,
          page: (page - 1) * ROWS_PER_PAGE
        })
        .then(response => {
          setRentals(response.results)
          setTotalPages(Math.ceil(response.total / ROWS_PER_PAGE) | 0)
        })
        .finally(() => setIsLoading(false))
        .catch(error => {
          console.error(error)
        })
    }
  }, [asset, setIsLoading, setRentals, page])

  const network = asset ? asset.network : undefined

  return (
    <div className={styles.main}>
      {isLoading && rentals.length === 0 ? null : rentals.length > 0 ? (
        <>
          <Header sub>{t('rental_history.title')}</Header>
          <NotMobile>
            <Table basic="very">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>
                    {t('rental_history.lessor')}
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    {t('rental_history.tenant')}
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    {t('rental_history.started_at')}
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    {capitalize(t('global.days'))}
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    {t('rental_history.price_per_day')}
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body className={isLoading ? 'is-loading' : ''}>
                {rentals.map(rental => (
                  <Table.Row key={rental.id}>
                    <Table.Cell>
                      <LinkedProfile address={rental.lessor!} />
                    </Table.Cell>
                    <Table.Cell>
                      <LinkedProfile address={rental.tenant!} />
                    </Table.Cell>
                    <Table.Cell title={formatDateTitle(rental.startedAt!)}>
                      {formatEventDate(rental.startedAt ?? 0)}
                    </Table.Cell>
                    <Table.Cell>
                      {t('rental_history.selected_days', {
                        days: rental.rentedDays ?? 0
                      })}
                    </Table.Cell>
                    <Table.Cell>
                      <Mana network={network} inline>
                        {formatWeiMANA(
                          getRentalChosenPeriod(rental).pricePerDay
                        )}
                      </Mana>
                    </Table.Cell>
                  </Table.Row>
                ))}
                {isLoading ? <Loader active /> : null}
              </Table.Body>
            </Table>
          </NotMobile>
          <Mobile>
            <div className={styles.mobileRentalsHistory}>
              {rentals.map(rental => (
                <div className={styles.mobileRentalsHistoryRow} key={rental.id}>
                  <div>
                    <T
                      id="rental_history.mobile_price"
                      values={{
                        days: rental.rentedDays,
                        pricePerDay: (
                          <Mana network={network} inline>
                            {formatWeiMANA(
                              getRentalChosenPeriod(rental).pricePerDay
                            )}
                          </Mana>
                        )
                      }}
                    ></T>
                  </div>
                  <div className={styles.mobileRentalsHistoryRowStartedAt}>
                    {formatEventDate(rental.startedAt!)}
                  </div>
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

export default React.memo(RentalHistory)
