import { useMemo, useCallback } from 'react'
import { Box, Radio, useTabletAndBelowMediaQuery } from 'decentraland-ui'
import { Rarity } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { PeriodOption } from '../../../modules/rental/types'

export type RentalPeriodFilterProps = {
  periods: PeriodOption[]
  onChange: (value: Rarity[]) => void
  defaultCollapsed?: boolean
}

export const RentalPeriodFilter = ({
  onChange,
  periods = [],
  defaultCollapsed = false
}: RentalPeriodFilterProps) => {
  const isMobileOrTablet = useTabletAndBelowMediaQuery()

  const handlePeriodsChange = useCallback(
    (event, data) => {
      console.log("holaa", event, data, onChange)
    },
    [onChange]
  )

  const header = useMemo(
    () =>
      isMobileOrTablet ? (
        <div className="mobile-box-header">
          <span className="box-filter-name">
            {t('nft_filters.rarities.title')}
          </span>
        </div>
      ) : (
        t('nft_filters.rarities.title')
      ),
    [isMobileOrTablet]
  )

  return (
    <Box
      header={header}
      className="filters-sidebar-box"
      collapsible
      defaultCollapsed={defaultCollapsed || isMobileOrTablet}
    >
      {Object.values(PeriodOption).map(option => (
        <Radio
          key={option}
          label={t(`rental_modal.create_listing_step.period_options.${option}`)}
          checked={periods.includes(option)}
          onClick={handlePeriodsChange}
        />
      ))}
    </Box>
  )
}
