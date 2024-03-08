import { useCallback, useMemo } from 'react'
import { Box, Radio, useTabletAndBelowMediaQuery } from 'decentraland-ui'
import { Network } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import './NetworkFilter.css'

export type NetworkFilterProps = {
  network?: Network
  onChange: (value: Network) => void
  defaultCollapsed?: boolean
}

export const NetworkFilter = ({ network, onChange, defaultCollapsed = false }: NetworkFilterProps) => {
  const isMobileOrTablet = useTabletAndBelowMediaQuery()
  const networkOptions = useMemo(() => {
    const options = [Network.ETHEREUM, Network.MATIC].filter(value => typeof value === 'string')
    return [
      {
        value: undefined,
        text: t('nft_filters.network.all_items')
      },
      ...options.map(network => ({
        value: network,
        text: t(`networks.${network.toLowerCase()}`)
      }))
    ]
  }, [])

  const handleChange = useCallback((_, { value }) => onChange(value), [onChange])

  const header = useMemo(
    () =>
      isMobileOrTablet ? (
        <div className="mobile-box-header">
          <span className="box-filter-name">{t('nft_filters.network.title')}</span>
          <span className="box-filter-value">{network ? t(`networks.${network.toLowerCase()}`) : t('nft_filters.network.all_items')}</span>
        </div>
      ) : (
        t('nft_filters.network.title')
      ),
    [network, isMobileOrTablet]
  )

  return (
    <Box header={header} className="filters-sidebar-box network-filter" collapsible defaultCollapsed={defaultCollapsed || isMobileOrTablet}>
      <div className="network-options filters-radio-group">
        {networkOptions.map(option => (
          <Radio
            key={option.text}
            type="radio"
            onChange={handleChange}
            label={option.text}
            value={option.value}
            name="network"
            checked={network === option.value}
          />
        ))}
      </div>
    </Box>
  )
}
