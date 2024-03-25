import { useMemo, useCallback } from 'react'
import classNames from 'classnames'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Box, CheckboxProps, Radio, useTabletAndBelowMediaQuery } from 'decentraland-ui'
import { PeriodOption } from '../../../modules/rental/types'
import { daysByPeriod } from '../../../modules/rental/utils'
import styles from './RentalPeriodFilter.module.css'

export type RentalPeriodFilterProps = {
  rentalDays?: number[]
  onChange: (value: number[]) => void
  defaultCollapsed?: boolean
}

export const RentalPeriodFilter = ({ onChange, rentalDays = [], defaultCollapsed = false }: RentalPeriodFilterProps) => {
  const isMobileOrTablet = useTabletAndBelowMediaQuery()
  const handleRentalDaysChange = useCallback(
    (_evt, { checked, value }: CheckboxProps) => {
      if (checked) {
        onChange([...rentalDays, Number(value)])
      } else {
        onChange(rentalDays.filter(period => period !== value))
      }
    },
    [rentalDays, onChange]
  )

  const allPeriodsSelected = useMemo(
    () => rentalDays.length === 0 || rentalDays.length === Object.values(PeriodOption).length,
    [rentalDays.length]
  )

  const header = useMemo(
    () =>
      isMobileOrTablet ? (
        <div className="mobile-box-header">
          <span className="box-filter-name">{t('nft_filters.periods.title')}</span>
          <span className="box-filter-value">
            {allPeriodsSelected
              ? t('nft_filters.periods.all_items')
              : t('nft_filters.periods.count_items', {
                  count: rentalDays.length
                })}
          </span>
        </div>
      ) : (
        t('nft_filters.periods.title')
      ),
    [isMobileOrTablet, rentalDays.length, allPeriodsSelected]
  )

  return (
    <Box
      header={header}
      className={classNames('filters-sidebar-box', styles.rentalPeriodContainer)}
      collapsible
      defaultCollapsed={defaultCollapsed || isMobileOrTablet}
    >
      {Object.values(PeriodOption).map(option => (
        <Radio
          key={option}
          label={t(`rental_modal.create_listing_step.period_options.${option}`)}
          checked={rentalDays.includes(daysByPeriod[option])}
          onClick={handleRentalDaysChange}
          value={daysByPeriod[option]}
          type="checkbox"
          data-testid={option}
          className="square-checkbox"
        />
      ))}
    </Box>
  )
}
