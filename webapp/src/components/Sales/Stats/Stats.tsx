import React, { useEffect } from 'react'
import { Loader } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { formatMANA } from '../../../lib/mana'
import { Props } from './Stats.types'
import './Stats.css'

const Stats = ({
  address,
  totalSales,
  ethereumEarned,
  maticEarned,
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
      />
      <Stat
        subtitle={t('sales.ethereum_earnings')}
        value={formatMANA(ethereumEarned)}
        isLoading={isLoading}
      />
      <Stat
        subtitle={t('sales.polygon_earnings')}
        value={formatMANA(maticEarned)}
        isLoading={isLoading}
      />
    </div>
  )
}

const Stat = ({
  value,
  subtitle,
  isLoading
}: {
  value: string
  subtitle: string
  isLoading: boolean
}) => {
  return (
    <div className="Stat">
      {isLoading ? (
        <div className="loader-container">
          <Loader inline active />
        </div>
      ) : (
        <>
          <div className="icon"></div>
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
