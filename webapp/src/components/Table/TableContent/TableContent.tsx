import React from 'react'
// import { Pagination, Row } from 'decentraland-ui'

import { Props } from './TableContent.types'
import { Table } from 'decentraland-ui'
import './TableContent.css'

const TableContent = (props: Props) => {
  const { empty, data, isLoading } = props

  console.log(empty)
  const headers = data.length > 0 ? Object.keys(data[0]) : null

  return (
    <div className={'TableContent'}>
      {headers ? (
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
        // aca mostrar el empty state
        <div>holaa</div>
      )}
      {/* {totalPages && totalPages > 1 ? (
        <Row center>
          <Pagination
            activePage={activePage}
            totalPages={totalPages}
            onPageChange={(_event, props) =>
              setPage && setPage(+props.activePage!)
            }
            firstItem={null}
            lastItem={null}
          />
        </Row>
      ) : null} */}
    </div>
  )
}

export default React.memo(TableContent)
