import { useCallback } from "react"
import { Box, CheckboxProps, Radio } from "decentraland-ui"
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { LANDFilters } from "../../Vendor/decentraland/types"
import './LandStatusFilter.css'

type LandStatusFilterProps = {
  landStatus: LANDFilters,
  onChange: (value: LANDFilters) => void
}

export const LandStatusFilter = ({ landStatus, onChange }: LandStatusFilterProps): JSX.Element => {
  const landStatusFilterOptions = [
    {
      name: t('nft_land_filters.all_land'),
      value: LANDFilters.ALL_LAND
    },
    {
      name: t('nft_land_filters.only_for_sale'),
      value: LANDFilters.ONLY_FOR_SALE
    },
    {
      name: t('nft_land_filters.only_for_rent'),
      value: LANDFilters.ONLY_FOR_RENT
    }
  ];

  const handleStatusChange = useCallback((_evt, props: CheckboxProps) => {
    onChange(props.value as LANDFilters)
  }, [onChange])

  return (
    <Box
      header={t('filters.status')}
      className="filters-sidebar-box land-status-filter"
      collapsible
    >
      <div className="filters-radio-group land-status-options">
        {landStatusFilterOptions.map(option => {
          return (
            <Radio
              type="radio"
              key={option.value}
              onChange={handleStatusChange}
              label={option.name}
              value={option.value}
              name="landStatus"
              checked={option.value === landStatus}
            />
          )
        })}
      </div>
    </Box>
  )
}
