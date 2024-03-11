import React, { ReactNode } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Header, Loader, Mobile, NotMobile, Pagination, Table } from 'decentraland-ui'
import { SALES_PER_PAGE } from '../../../modules/routing/utils'
import { formatWeiMANA } from '../../../lib/mana'
import AssetCell from '../../OnSaleOrRentList/AssetCell'
import { LinkedProfile } from '../../LinkedProfile'
import { Mana } from '../../Mana'
import { Props } from './Activity.types'
import './Activity.css'

const Activity = ({ count, sales, assets, page, isLoading, onBrowse }: Props) => {
  const pages = Math.ceil(count / SALES_PER_PAGE)

  const hasPagination = pages > 1

  return (
    <div className="Activity">
      <Header>{t('sales.activity')}</Header>
      {isLoading ? (
        <div className="loader-container">
          <Loader active inline />
        </div>
      ) : (
        <>
          <Mobile>
            {sales.reduce((acc, sale) => {
              const asset = assets[sale.id]
              if (asset) {
                acc.push(
                  <div key={sale.id} className="mobile-row">
                    <AssetCell asset={assets[sale.id]} />

                    <Mana showTooltip network={sale.network} inline>
                      {formatWeiMANA(sale.price)}
                    </Mana>
                  </div>
                )
              }
              return acc
            }, [] as ReactNode[])}
          </Mobile>
          <NotMobile>
            <Table basic="very">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>{t('global.item')}</Table.HeaderCell>
                  <Table.HeaderCell>{t('global.time')}</Table.HeaderCell>
                  <Table.HeaderCell>{t('global.buyer')}</Table.HeaderCell>
                  <Table.HeaderCell>{t('global.type')}</Table.HeaderCell>
                  <Table.HeaderCell>{t('global.price')}</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {sales.reduce((acc, sale) => {
                  const asset = assets[sale.id]
                  if (asset) {
                    acc.push(
                      <Table.Row key={sale.id}>
                        <Table.Cell>
                          <AssetCell asset={assets[sale.id]} />
                        </Table.Cell>
                        <Table.Cell>
                          {formatDistanceToNow(sale.timestamp, {
                            addSuffix: true
                          })}
                        </Table.Cell>
                        <Table.Cell>
                          <LinkedProfile address={sale.buyer} inline />
                        </Table.Cell>
                        <Table.Cell>{t(`global.${sale.type}`)}</Table.Cell>
                        <Table.Cell>
                          <Mana showTooltip network={sale.network} inline>
                            {formatWeiMANA(sale.price)}
                          </Mana>
                        </Table.Cell>
                      </Table.Row>
                    )
                  }
                  return acc
                }, [] as ReactNode[])}
              </Table.Body>
            </Table>
          </NotMobile>
          {count === 0 && <div className="empty">{t('global.no_results')}</div>}
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
        </>
      )}
    </div>
  )
}

export default React.memo(Activity)
