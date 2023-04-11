import React from 'react'
// import { Pagination, Row } from 'decentraland-ui'

import { Props } from './TableContent.types'
import { Loader, Pagination, Table } from 'decentraland-ui'
import './TableContent.css'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { ROWS_PER_PAGE } from '../../AssetPage/OwnersTable/OwnersTable'

const TableContent = (props: Props) => {
  const {
    empty,
    data,
    isLoading,
    totalPages,
    activePage = 1,
    setPage,
    total,
    rowsPerPage = ROWS_PER_PAGE
  } = props

  const headers = data.length > 0 ? Object.keys(data[0]) : null

  return (
    <div className={'TableContent'}>
      {isLoading ? (
        <div className={'emptyTable'}>
          <Loader active data-testid="loader" />
        </div>
      ) : headers ? (
        <Table basic="very" data-testid="listings-table">
          <Table.Row>
            {headers.map(header => (
              <Table.HeaderCell key={header}>
                <span className={'header'}>{header}</span>
              </Table.HeaderCell>
            ))}
          </Table.Row>
          <Table.Body className={isLoading ? 'is-loading' : ''}>
            {data?.map((data: any) => (
              <Table.Row key={data}>
                {headers.map((header: string) => (
                  <Table.Cell>{data[header]}</Table.Cell>
                ))}
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      ) : (
        empty()
      )}
      {totalPages && totalPages > 1 ? (
        <div className="pagination">
          {`${t('global.showing')} ${activePage}-${activePage *
            rowsPerPage}  ${t('global.of')} ${total}`}
          <Pagination
            activePage={activePage}
            totalPages={totalPages}
            onPageChange={(_event, props) =>
              setPage && setPage(+props.activePage!)
            }
            firstItem={null}
            lastItem={null}
          />
        </div>
      ) : null}
    </div>
  )
}

export default React.memo(TableContent)
