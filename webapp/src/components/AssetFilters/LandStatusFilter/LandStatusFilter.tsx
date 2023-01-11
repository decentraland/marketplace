import { useCallback, useMemo } from 'react'
import { Box, CheckboxProps, Radio, useMobileMediaQuery } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { LANDFilters } from '../../Vendor/decentraland/types'
import './LandStatusFilter.css'
import { getLandLabel } from '../../../utils/filters'

type LandStatusFilterProps = {
  landStatus: LANDFilters
  onChange: (value: LANDFilters) => void
}

export const LandStatusFilter = ({
  landStatus,
  onChange
}: LandStatusFilterProps): JSX.Element => {
  const isMobile = useMobileMediaQuery()
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
      isMobile ? (
        <div className="mobile-box-header">
          <span className="box-filter-name">{t('filters.status')}</span>
          <span className="box-filter-value">{getLandLabel({ landStatus })}</span>
        </div>
      ) : (
        t('filters.status')
      ),
    [isMobile, landStatus]
  )

  return (
    <Box
      header={header}
      className="filters-sidebar-box land-status-filter"
      collapsible
      defaultCollapsed={isMobile}
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
