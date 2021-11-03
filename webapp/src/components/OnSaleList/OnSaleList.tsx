import React from 'react'
import { Table, Loader } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Props } from './OnSaleList.types'
import OnSaleListItem from './OnSaleListItem'

const OnSaleList = ({ items, isLoading }: Props) => {
  if (isLoading) {
    return (
      <>
        <div className="overlay" />
        <Loader size="massive" active />
      </>
    )
  }
  return (
    <Table basic="very">
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>{t('global.item')}</Table.HeaderCell>
          <Table.HeaderCell>{t('global.type')}</Table.HeaderCell>
          <Table.HeaderCell>{t('global.sale_type')}</Table.HeaderCell>
          <Table.HeaderCell>{t('global.sell_price')}</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {items.map((item, i) => (
          <OnSaleListItem key={i} {...item} />
        ))}
      </Table.Body>
    </Table>
  )
}

export default React.memo(OnSaleList)
