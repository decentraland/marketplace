import React, { useCallback, useMemo, useState } from 'react'
import {
  Modal,
  Button,
  ModalNavigation,
  Field,
  Radio,
  Header,
  Popup,
  InputOnChangeData
} from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { toFixedMANAValue } from 'decentraland-dapps/dist/lib/mana'
import { PeriodOption } from '../../../modules/rental/types'
import { formatWeiMANA, parseMANANumber } from '../../../lib/mana'
import {
  convertDateToDateInputValue,
  getDefaultExpirationDate
} from '../../../modules/order/utils'
import {
  daysByPeriod,
  getMaxPriceOfPeriods,
  periodsByDays
} from '../../../modules/rental/utils'
import { ManaField } from '../../ManaField'
import { Props } from './CreateOrEditListingStep.types'
import styles from './CreateOrEditListingStep.module.css'

const CreateListingStep = (props: Props) => {
  const { open, onCancel, nft, onCreate, rental } = props

  // Editing properties
  const oldPrice = useMemo(
    () => (rental ? formatWeiMANA(getMaxPriceOfPeriods(rental)) : null),
    [rental]
  )
  const oldPeriods = useMemo(
    () =>
      rental
        ? rental.periods.map(period => periodsByDays[period.maxDays])
        : null,
    [rental]
  )
  const oldExpirationDate = useMemo(
    () =>
      rental ? convertDateToDateInputValue(new Date(rental.expiration)) : null,
    [rental]
  )

  // Form values
  const [pricePerDayInput, setPricePerDayInput] = useState(oldPrice ?? '')
  const [periodOptions, setPeriodOptions] = useState<PeriodOption[]>(
    oldPeriods ?? []
  )
  const [expiresAt, setExpiresAt] = useState(
    oldExpirationDate ?? getDefaultExpirationDate()
  )

  // Handlers
  const handleSubmit = useCallback(() => {
    onCreate(
      nft,
      parseMANANumber(pricePerDayInput),
      periodOptions,
      Number(new Date(expiresAt))
    )
  }, [onCreate, nft, pricePerDayInput, periodOptions, expiresAt])

  const createOptionHandler = (periodOption: PeriodOption) => () => {
    const shouldAdd = !periodOptions.includes(periodOption)
    if (shouldAdd) {
      setPeriodOptions(
        [...periodOptions, periodOption].sort((a, b) =>
          daysByPeriod[a] > daysByPeriod[b] ? 1 : -1
        )
      )
    } else {
      setPeriodOptions(periodOptions.filter(option => option !== periodOption))
    }
  }

  // Validations
  const isInvalidPrice = parseMANANumber(pricePerDayInput) < 0
  const isInvalidExpirationDate = new Date(expiresAt).getTime() < Date.now()
  const isInvalid =
    isInvalidPrice || isInvalidExpirationDate || periodOptions.length === 0
  const showInvalidPriceError = pricePerDayInput !== '' && isInvalidPrice
  const isUpdated =
    oldExpirationDate !== expiresAt ||
    pricePerDayInput !== oldPrice ||
    (oldPeriods &&
      (oldPeriods.length !== periodOptions.length ||
        !oldPeriods.every(period => periodOptions.includes(period))))

  const handlePriceChange = useCallback(
    (_event: React.ChangeEvent<HTMLInputElement>, props: InputOnChangeData) => {
      setPricePerDayInput(toFixedMANAValue(props.value))
    },
    []
  )

  const handleExpirationDateChange = useCallback(
    (_event: React.ChangeEvent<HTMLInputElement>, props: InputOnChangeData) => {
      setExpiresAt(props.value || getDefaultExpirationDate())
    },
    []
  )

  return (
    <Modal open={open} size="tiny" className={styles.modal}>
      <ModalNavigation
        title={
          rental
            ? t('rental_modal.create_listing_step.titles.edit')
            : t('rental_modal.create_listing_step.titles.create')
        }
        onClose={onCancel}
      />
      <Modal.Content>
        <div className={styles.pricePerDay}>
          <ManaField
            label={t('rental_modal.create_listing_step.price_per_day')}
            type="text"
            placeholder={1000}
            network={nft.network}
            value={pricePerDayInput}
            focus={true}
            error={showInvalidPriceError}
            onChange={handlePriceChange}
            message={
              showInvalidPriceError
                ? t('rental_modal.create_listing_step.invalid_price')
                : t('rental_modal.create_listing_step.dao_fee')
            }
          />
        </div>
        <div>
          <Header sub>
            {t('rental_modal.create_listing_step.periods')}
            <Popup
              className={styles.periodsTooltip}
              content={t('rental_modal.create_listing_step.periods_tooltip')}
              trigger={<i className={styles.info} />}
              position="top center"
              on="hover"
            ></Popup>
          </Header>

          <div className={styles.periodOptions}>
            {Object.values(PeriodOption).map(option => (
              <Radio
                key={option}
                label={t(
                  `rental_modal.create_listing_step.period_options.${option}`
                )}
                checked={periodOptions.includes(option)}
                onClick={createOptionHandler(option)}
              />
            ))}
          </div>
        </div>
        <div className={styles.expirationDate}>
          <Field
            label={t(
              'rental_modal.create_listing_step.listing_expiration_date'
            )}
            type="date"
            value={expiresAt}
            onChange={handleExpirationDateChange}
            error={isInvalidExpirationDate}
            message={
              isInvalidExpirationDate
                ? t('rental_modal.create_listing_step.invalid_date')
                : undefined
            }
          />
        </div>
      </Modal.Content>
      <Modal.Actions className={styles.actions}>
        {!rental ? (
          <Button primary onClick={handleSubmit} disabled={isInvalid}>
            {t('rental_modal.create_listing_step.put_for_rent')}
          </Button>
        ) : (
          <>
            <Button
              primary
              onClick={handleSubmit}
              disabled={isInvalid || !isUpdated}
            >
              {t('rental_modal.create_listing_step.update_listing')}
            </Button>
            <Button secondary onClick={handleSubmit} disabled={isInvalid}>
              {t('rental_modal.create_listing_step.remove_listing')}
            </Button>
          </>
        )}
      </Modal.Actions>
    </Modal>
  )
}

export default React.memo(CreateListingStep)
