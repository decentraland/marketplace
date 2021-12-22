import React, { ReactNode, useRef, useState } from 'react'
import { Dropdown, Header, Profile, Table } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Props } from './Sales.types'
import AssetCell from '../OnSaleList/AssetCell'
import { formatDistanceToNow } from '../../lib/date'
import { Mana } from '../Mana'
import { formatMANA } from '../../lib/mana'
import './Sales.css'

const Sales = ({ sales, assets }: Props) => {
  const options = useRef([{ value: 'allTime', text: 'All Time' }])

  const [current, setCurrent] = useState(options.current[0].value)

  return (
    <div className="Sales">
      <div className="header-with-filter">
        <Header>Stats</Header>
        <Dropdown
          direction="left"
          value={current}
          options={options.current}
          onChange={(_, data) => setCurrent(data.value as any)}
        />
      </div>
      <div className="simple-stats">
        <SimpleStat subtitle="Total sales" value="4" />
        <SimpleStat subtitle="Ethereum earnings" value="11,235" />
        <SimpleStat subtitle="Polygon earnings" value="30,600" />
      </div>
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
      </div>
    </div>
  )
}

const SimpleStat = ({
  value,
  subtitle
}: {
  value: string
  subtitle: string
}) => {
  return (
    <div className="simple-stat">
      <div className="simple-stat-icon"></div>
      <div className="simple-stat-details">
        <div className="simple-stat-value">{value}</div>
        <div className="simple-stat-subtitle">{subtitle}</div>
      </div>
    </div>
  )
}

export default React.memo(Sales)
