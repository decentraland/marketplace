import React, { memo, useMemo, useCallback, useState } from 'react'
import { ethers } from 'ethers'
import classNames from 'classnames'
import add from 'date-fns/add'
import format from 'date-fns/format'
import { Dropdown, DropdownItemProps, DropdownProps } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { RentalListingPeriod } from '@dcl/schemas'
import { formatWeiMANA } from '../../../../lib/mana'
import { Mana } from '../../../Mana'
import { Props } from './PeriodsDropdown.types'
import styles from './PeriodsDropdown.module.css'

const Trigger = ({ value, periods }: { value: number | undefined; periods: RentalListingPeriod[] }) => {
  const period = value !== undefined ? periods[value] : undefined
  const pricePerRent = period
    ? ethers.BigNumber.from(period.pricePerDay).mul(period.maxDays).toString()
    : ethers.BigNumber.from(periods[0].pricePerDay).mul(periods[0].maxDays).toString()

  return (
    <div className={period ? styles.trigger : styles.triggerPlaceholder}>
      <div className={styles.days}>
        {period ? period.maxDays : periods[0].maxDays} {t('global.days')}
      </div>
      <div className={styles.pricePerPeriod}>
        <Mana className={styles.mana}>{formatWeiMANA(pricePerRent)}</Mana>
      </div>
    </div>
  )
}

const PeriodsDropdown = ({ value, periods, className, onChange }: Props) => {
  const [isOpenDropdown, setIsOpenDropdown] = useState(false)

  const handleOnChange = useCallback(
    (_event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => {
      onChange(data.value as number)
    },
    [onChange]
  )

  const options: DropdownItemProps[] = useMemo(
    () =>
      periods.map((period, index) => {
        const pricePerRent = ethers.BigNumber.from(period.pricePerDay).mul(period.maxDays).toString()
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
                <Mana className={styles.mana}>{formatWeiMANA(pricePerRent)}</Mana>
              </div>
            </div>
          )
        }
      }),
    [periods]
  )

  return (
    <Dropdown
      className={classNames(styles.periodDropdown, className)}
      trigger={value !== undefined || isOpenDropdown ? <Trigger value={value} periods={periods} /> : null}
      onClick={() => setIsOpenDropdown(prevState => !prevState)}
      value={value}
      placeholder={t('asset_page.sales_rent_action_box.select_period')}
      options={options}
      onChange={handleOnChange}
    />
  )
}

export default memo(PeriodsDropdown)
