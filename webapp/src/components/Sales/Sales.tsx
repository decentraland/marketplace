import React, { ReactNode } from 'react'
import { Header, Loader, Pagination, Profile, Table } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Props } from './Sales.types'
import AssetCell from '../OnSaleList/AssetCell'
import { formatDistanceToNow } from '../../lib/date'
import { Mana } from '../Mana'
import { formatMANA } from '../../lib/mana'
import { SALES_PER_PAGE } from '../../modules/routing/utils'
import Stats from './Stats'
import './Sales.css'

const Sales = ({ sales, count, assets, page, isLoading, onBrowse }: Props) => {
  const pages = Math.ceil(count / SALES_PER_PAGE)

  const hasPagination = pages > 1

  return (
    <div className="Sales">
      <div className="header-with-filter">
        <Header>Stats</Header>
      </div>
      <Stats />
      {isLoading ? (
        <Loader size="massive" active />
      ) : (
        <div className="activity">
          <Header>Activity</Header>
          <Table basic="very">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>{t('global.item')}</Table.HeaderCell>
                <Table.HeaderCell>{t('global.time')}</Table.HeaderCell>
                <Table.HeaderCell>{t('global.buyer')}</Table.HeaderCell>
                <Table.HeaderCell>{t('global.price')}</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {sales.reduce((acc, sale) => {
                const asset = assets[sale.id]
                if (asset) {
                  acc.push(
                    <Table.Row>
                      <AssetCell asset={assets[sale.id]} />
                      <Table.Cell>
                        {formatDistanceToNow(sale.timestamp, {
                          addSuffix: true
                        })}
                      </Table.Cell>
                      <Table.Cell>
                        <Profile address={sale.buyer} />
                      </Table.Cell>
                      <Table.Cell>
                        <Mana network={sale.network} inline>
                          {formatMANA(sale.price)}
                        </Mana>
                      </Table.Cell>
                    </Table.Row>
                  )
                }
                return acc
              }, [] as ReactNode[])}
            </Table.Body>
          </Table>
          {hasPagination && (
            <div className="pagination">
              <Pagination
                totalPages={pages}
                activePage={page}
                onPageChange={(_, data) => {
                  if (page !== data.activePage) {
                    onBrowse({ page: Number(data.activePage) })
                  }
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default React.memo(Sales)
