import { useCallback, useMemo } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Box, CheckboxProps, Radio, useTabletAndBelowMediaQuery } from 'decentraland-ui'
import { getLandLabel } from '../../../utils/filters'
import { LANDFilters } from '../../Vendor/decentraland/types'
import './LandStatusFilter.css'

type LandStatusFilterProps = {
  landStatus: LANDFilters
  onChange: (value: LANDFilters) => void
  defaultCollapsed?: boolean
}

export const LandStatusFilter = ({ landStatus, onChange, defaultCollapsed = false }: LandStatusFilterProps): JSX.Element => {
  const isMobileOrTablet = useTabletAndBelowMediaQuery()
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
  ]

  const handleStatusChange = useCallback(
    (_evt, props: CheckboxProps) => {
      onChange(props.value as LANDFilters)
    },
    [onChange]
  )

  const header = useMemo(
    () =>
      isMobileOrTablet ? (
        <div className="mobile-box-header">
          <span className="box-filter-name">{t('filters.status')}</span>
          <span className="box-filter-value">{getLandLabel({ landStatus })}</span>
        </div>
      ) : (
        t('filters.status')
      ),
    [isMobileOrTablet, landStatus]
  )

  return (
    <Box
      header={header}
      className="filters-sidebar-box land-status-filter"
      collapsible
      defaultCollapsed={defaultCollapsed || isMobileOrTablet}
    >
      <div className="filters-radio-group land-status-options">
        {landStatusFilterOptions.map(option => {
          return (
            <Radio
              id={`landStatus-${option.value}`}
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
