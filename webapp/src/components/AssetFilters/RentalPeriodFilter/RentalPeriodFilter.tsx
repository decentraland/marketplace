import { useMemo, useCallback } from 'react'
import { Box, Radio, useTabletAndBelowMediaQuery } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { PeriodOption } from '../../../modules/rental/types'
import styles from './RentalPeriodFilter.module.css'
import classNames from 'classnames'

export type RentalPeriodFilterProps = {
  periods: PeriodOption[]
  onChange: (value: PeriodOption[]) => void
  defaultCollapsed?: boolean
}

export const RentalPeriodFilter = ({
  onChange,
  periods = [],
  defaultCollapsed = false
}: RentalPeriodFilterProps) => {
  const isMobileOrTablet = useTabletAndBelowMediaQuery()

  const handlePeriodsChange = useCallback(
    (_evt, { checked, value }) => {
      if (checked) {
        onChange([...periods, value])
      } else {
        onChange(periods.filter((period) => period === value ))
      }
    },
    [periods, onChange]
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
      className={classNames("filters-sidebar-box", styles.rentalPeriodContainer)}
      collapsible
      defaultCollapsed={defaultCollapsed || isMobileOrTablet}
    >
      {Object.values(PeriodOption).map(option => (
        <Radio
          key={option}
          label={t(`rental_modal.create_listing_step.period_options.${option}`)}
          checked={periods.includes(option)}
          onClick={handlePeriodsChange}
          value={option}
          type="checkbox"
        />
      ))}
    </Box>
  )
}
