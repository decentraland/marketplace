import React, { ReactNode, useEffect } from 'react'
import { Icon, Loader } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { formatWeiMANA } from '../../../lib/mana'
import { Props } from './Stats.types'
import { Mana } from '../../Mana'
import { Network } from '@dcl/schemas'
import './Stats.css'

const Stats = ({
  address,
  totalSales,
  totalEarnings,
  ethereumEarned,
  maticEarned,
  royalties,
  isLoading,
  onFetchMetrics
}: Props) => {
  useEffect(() => onFetchMetrics(address), [address, onFetchMetrics])

  return (
    <div className="Stats">
      <Stat
        subtitle={t('sales.total_sales')}
        value={totalSales.toLocaleString()}
        isLoading={isLoading}
        icon={<Icon className="total-sales-icon" name="tag" size="large" />}
      />
      <Stat
        subtitle={t('sales.total_earnings')}
        value={formatWeiMANA(totalEarnings)}
        isLoading={isLoading}
        icon={
          <Icon
            className="total-earnings-icon"
            name="shopping bag"
            size="large"
          />
        }
      />
      <Stat
        subtitle={t('sales.royalties')}
        value={formatWeiMANA(royalties)}
        isLoading={isLoading}
        icon={<Icon className="royalties-icon" name="star" size="large" />}
      />
      <Stat
        subtitle={t('sales.ethereum_earnings')}
        value={formatWeiMANA(ethereumEarned)}
        isLoading={isLoading}
        icon={
          <Mana
            className="ethereum-earnings-icon"
            network={Network.ETHEREUM}
            size="large"
          />
        }
      />
      <Stat
        subtitle={t('sales.polygon_earnings')}
        value={formatWeiMANA(maticEarned)}
        isLoading={isLoading}
        icon={
          <Mana
            className="polygon-earnings-icon"
            network={Network.MATIC}
            size="medium"
          />
        }
      />
    </div>
  )
}

const Stat = ({
  value,
  subtitle,
  isLoading,
  icon
}: {
  value: string
  subtitle: string
  isLoading: boolean
  icon: ReactNode
}) => {
  return (
    <div className="Stat">
      {isLoading ? (
        <div className="loader-container">
          <Loader inline active />
        </div>
      ) : (
        <>
          <div className="icon">{icon}</div>
          <div className="details">
            <div className="value">{value}</div>
            <div className="subtitle">{subtitle}</div>
          </div>
        </>
      )}
    </div>
  )
}

export default React.memo(Stats)
