import React from 'react'
import { Loader, Pagination, Table, useMobileMediaQuery } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { ROWS_PER_PAGE } from '../../AssetPage/OwnersTable/OwnersTable'
import { Props } from './TableContent.types'
import './TableContent.css'

const TABLE_SIBLINGS_RANGE_MOBILE = 0
const TABLE_SIBLINGS_RANGE_DESKTOP = 1

const TableContent = (props: Props) => {
  const { empty, data, isLoading, totalPages, activePage = 1, setPage, total, rowsPerPage = ROWS_PER_PAGE, hasHeaders = false } = props

  const isMobile = useMobileMediaQuery()
  const headers = data.length > 0 ? Object.keys(data[0]) : null
  const hasPagination = totalPages && totalPages > 1

  return (
    <div className={`TableContent ${!hasPagination ? 'radiusEnding' : ''} ${!hasHeaders ? 'emptyHeaders' : ''}`}>
      {isLoading ? (
        <div className={'emptyTable'}>
          <Loader active data-testid="loader" />
        </div>
      ) : headers ? (
        <Table basic="very" data-testid="table-content">
          <Table.Body className={isLoading ? 'is-loading' : ''}>
            <Table.Row>
              {headers.map(header => (
                <Table.HeaderCell key={header}>
                  <span>{header}</span>
                </Table.HeaderCell>
              ))}
            </Table.Row>
            {data?.map((data: any, index) => (
              <Table.Row key={index}>
                {headers.map((header: string) => (
                  <Table.Cell
                    style={{
                      width: `${100 / headers.length}%`
                    }}
                    key={header}
                  >
                    {data[header]}
                  </Table.Cell>
                ))}
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      ) : (
        empty()
      )}
      {hasPagination && total ? (
        <div className="pagination">
          {`${t('global.showing')} ${(activePage - 1) * rowsPerPage + 1}-${Math.min(activePage * rowsPerPage, total)}  ${t(
            'global.of'
          )} ${total}`}
          <Pagination
            siblingRange={isMobile ? TABLE_SIBLINGS_RANGE_MOBILE : TABLE_SIBLINGS_RANGE_DESKTOP}
            activePage={activePage}
            totalPages={totalPages}
            onPageChange={(_event, props) => setPage && setPage(+props.activePage!)}
            firstItem={null}
            lastItem={null}
          />
        </div>
      ) : null}
    </div>
  )
}

export default React.memo(TableContent)
