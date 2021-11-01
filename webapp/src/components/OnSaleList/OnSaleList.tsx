import React from 'react'
import { Table } from 'decentraland-ui'
import { Props } from './OnSaleList.types'
import OnSaleListItem from './OnSaleListItem'

const OnSaleList = ({ items }: Props) => {
  return (
    <div>
      <Table basic="very">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Item</Table.HeaderCell>
            <Table.HeaderCell>Type</Table.HeaderCell>
            <Table.HeaderCell>Sale type</Table.HeaderCell>
            <Table.HeaderCell>Sell price</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {items.map(item => (
            <OnSaleListItem item={item} />
          ))}
        </Table.Body>
      </Table>
    </div>
  )
}

export default React.memo(OnSaleList)
