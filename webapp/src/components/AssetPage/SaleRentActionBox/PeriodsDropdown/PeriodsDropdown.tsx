import { ethers } from 'ethers'
import React, { memo, useMemo, useCallback } from 'react'
import add from 'date-fns/add'
import format from 'date-fns/format'
import { Dropdown, DropdownItemProps, DropdownProps } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { RentalListingPeriod } from '@dcl/schemas'
import { formatWeiMANA } from '../../../../lib/mana'
import { Mana } from '../../../Mana'
import styles from './PeriodsDropdown.module.css'
import { Props } from './PeriodsDropdown.types'

const Trigger = ({ period }: { period: RentalListingPeriod }) => {
  const pricePerRent = ethers.BigNumber.from(period.pricePerDay)
    .mul(period.maxDays)
    .toString()

  return (
    <div className={styles.trigger}>
      <div className={styles.days}>
        {period.maxDays} {t('global.days')}
      </div>
      <div className={styles.pricePerPeriod}>
        <Mana>{formatWeiMANA(pricePerRent)}</Mana>
      </div>
    </div>
  )
}

const PeriodsDropdown = ({ value, periods, onChange }: Props) => {
  const handleOnChange = useCallback(
    (_event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => {
      onChange(data.value as number)
    },
    [onChange]
  )

  const options: DropdownItemProps[] = useMemo(
    () =>
      periods.map((period, index) => {
        const pricePerRent = ethers.BigNumber.from(period.pricePerDay)
          .mul(period.maxDays)
          .toString()
        const startDate = new Date()
        const endDate = add(startDate, { days: period.maxDays })
        return {
          key: index,
          value: index,
          content: (
            <div className={styles.item}>
              <div className={styles.period}>
                <div>
                  {period.maxDays} {t('global.days')}
                </div>
                <div className={styles.until}>
                  {t('asset_page.sales_rent_action_box.until', {
                    from_date: format(startDate, 'MMM dd'),
                    to_date: format(endDate, 'MMM dd')
                  })}
                </div>
              </div>
              <div className={styles.periodPrice}>
                <Mana>{formatWeiMANA(pricePerRent)}</Mana>
              </div>
            </div>
          )
        }
      }),
    [periods]
  )

  return (
    <Dropdown
      className={styles.periodDropdown}
      trigger={<Trigger period={periods[value]} />}
      value={value}
      options={options}
      onChange={handleOnChange}
      defaultValue={0}
    />
  )
}

export default memo(PeriodsDropdown)
