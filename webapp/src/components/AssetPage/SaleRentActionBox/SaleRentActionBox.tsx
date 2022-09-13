import { useCallback, useMemo, useState } from 'react'
import classNames from 'classnames'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Button } from 'decentraland-ui'
import { formatWeiMANA } from '../../../lib/mana'
import { getMaxPriceOfPeriods } from '../../../modules/rental/utils'
import { Mana } from '../../Mana'
import { ManaToFiat } from '../../ManaToFiat'
import { PeriodsDropdown } from './PeriodsDropdown'
import { Props } from './SaleRentActionBox.types'
import styles from './SaleRentActionBox.module.css'

enum View {
  SALE,
  RENT
}

const SaleRentActionBox = ({ asset: _asset, rental }: Props) => {
  const [selectedRentalPeriodIndex, setSelectedRentalPeriodIndex] = useState<
    number
  >(0)
  const [view, setView] = useState(View.RENT)
  const handleOnRent = useCallback(
    () => rental?.periods[selectedRentalPeriodIndex],
    [rental, selectedRentalPeriodIndex]
  )
  const maxPriceOfPeriods: string | null = useMemo(
    () => (rental ? getMaxPriceOfPeriods(rental) : null),
    [rental]
  )
  const setRentView = useCallback(() => setView(View.RENT), [])
  const setSaleView = useCallback(() => setView(View.SALE), [])

  return rental && maxPriceOfPeriods ? (
    <div>
      <div className={styles.viewSelector}>
        <button
          onClick={setSaleView}
          disabled={view === View.SALE}
          className={classNames(styles.viewOption, {
            [styles.selectedViewOption]: view === View.SALE
          })}
        >
          {t('global.sale')}
        </button>
        <button
          onClick={setRentView}
          disabled={view === View.RENT}
          className={classNames(styles.viewOption, {
            [styles.selectedViewOption]: view === View.RENT
          })}
        >
          {t('global.rent')}
        </button>
      </div>
      <div className={styles.price}>
        <div className={styles.title}>{t('global.price')}</div>
        <div className={styles.priceValue}>
          <Mana
            className={styles.priceInMana}
            withTooltip
            size="medium"
            network={rental.network}
          >
            {formatWeiMANA(maxPriceOfPeriods)}
          </Mana>
          <span className={styles.perDay}>/{t('global.day')}</span>
          <span className={styles.priceInFiat}>
            (<ManaToFiat mana={maxPriceOfPeriods} />/{t('global.day')})
          </span>
        </div>
      </div>
      <PeriodsDropdown
        onChange={setSelectedRentalPeriodIndex}
        value={selectedRentalPeriodIndex}
        periods={rental.periods}
      />
      <Button primary onClick={handleOnRent} className={styles.rent}>
        {t('global.rent')}
      </Button>
    </div>
  ) : null
}

export default SaleRentActionBox
