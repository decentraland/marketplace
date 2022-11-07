import React, { useState, useEffect, useMemo } from 'react'
import classNames from 'classnames'
import {
  Header,
  Table,
  Mobile,
  NotMobile,
  Pagination,
  Loader,
  Row
} from 'decentraland-ui'

import { Props } from './HistoryTable.types'
import styles from './HistoryTable.module.css'
import { RentalListing, Sale } from '@dcl/schemas'

const ROWS_PER_PAGE = 12

const HistoryTable = (props: Props) => {
  const {
    asset,
    title,
    loadHistoryItems,
    historyItemsHeaders,
    getHistoryItemDesktopColumns,
    getHistoryItemMobileColumns
  } = props

  const [historyItems, setHistoryItems] = useState(
    [] as (Sale | RentalListing)[]
  )
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const mobileRows = useMemo(
    () =>
      historyItems.map(historyItem => getHistoryItemMobileColumns(historyItem)),
    [historyItems, getHistoryItemMobileColumns]
  )

  // We're doing this outside of redux to avoid having to store all orders when we only care about the last open one
  useEffect(() => {
    if (asset) {
      setIsLoading(true)
      loadHistoryItems((page - 1) * ROWS_PER_PAGE, ROWS_PER_PAGE)
        .then(response => {
          setHistoryItems(response.data)
          setTotalPages(Math.ceil(response.total / ROWS_PER_PAGE) | 0)
        })
        .finally(() => setIsLoading(false))
        .catch(error => {
          console.error(error)
        })
    }
  }, [asset, setIsLoading, setHistoryItems, page, loadHistoryItems])

  return (
    <div className={styles.main}>
      {isLoading && historyItems.length === 0 ? null : historyItems.length >
        0 ? (
        <>
          <Header sub>{title}</Header>
          <NotMobile>
            <Table basic="very">
              <Table.Header>
                <Table.Row>
                  {historyItemsHeaders.map((historyItemsHeader, index) => (
                    <Table.HeaderCell key={index} {...historyItemsHeader.props}>
                      {historyItemsHeader.content}
                    </Table.HeaderCell>
                  ))}
                </Table.Row>
              </Table.Header>
              <Table.Body
                className={classNames({ isLoading: [styles.isLoading] })}
              >
                {historyItems.map(historyItem => (
                  <Table.Row key={historyItem.id}>
                    {getHistoryItemDesktopColumns(historyItem).map(
                      (column, index) => (
                        <Table.Cell key={index} {...column.props}>
                          {column.content}
                        </Table.Cell>
                      )
                    )}
                  </Table.Row>
                ))}
                {isLoading ? <Loader active /> : null}
              </Table.Body>
            </Table>
          </NotMobile>
          <Mobile>
            <div className={styles.mobileHistoryTable}>
              {mobileRows.map(historyItem => (
                <div
                  className={styles.mobileHistoryTableRow}
                  key={historyItem.index}
                >
                  <div>{historyItem.summary}</div>
                  <div className={styles.mobileRentalsHistoryRowStartedAt}>
                    {historyItem.date}
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

export default React.memo(HistoryTable)
