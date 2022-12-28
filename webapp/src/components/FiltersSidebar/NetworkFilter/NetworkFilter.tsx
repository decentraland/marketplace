import { useCallback, useMemo } from 'react'
import { Box, Radio } from 'decentraland-ui'
import { Network } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import './NetworkFilter.css'

export type NetworkFilterProps = {
  network?: Network
  onChange: (value: Network) => void
}

export const NetworkFilter = ({ network, onChange }: NetworkFilterProps) => {
  const networkOptions = useMemo(() => {
    const options = Object.values(Network).filter(
      value => typeof value === 'string'
    ) as Network[]
    return [
      {
        value: undefined,
        text: t('nft_filters.all_networks')
      },
      ...options.map(network => ({
        value: network,
        text: t(`networks.${network.toLowerCase()}`)
      }))
    ]
  }, [])

  const handleChange = useCallback((_, { value }) => onChange(value), [
    onChange
  ])

  return (
    <Box
      header={t('nft_filters.network')}
      className="filters-sidebar-box network-filter"
      collapsible
    >
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
