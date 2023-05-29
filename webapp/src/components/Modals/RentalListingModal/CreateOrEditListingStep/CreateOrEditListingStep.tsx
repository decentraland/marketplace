import React, { useCallback, useMemo, useState } from 'react'
import { ethers } from 'ethers'
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
import {
  PeriodOption,
  UpsertRentalOptType
} from '../../../../modules/rental/types'
import { parseMANANumber } from '../../../../lib/mana'
import {
  convertDateToDateInputValue,
  getDefaultExpirationDate
} from '../../../../modules/order/utils'
import {
  daysByPeriod,
  getMaxPriceOfPeriods,
  periodsByDays
} from '../../../../modules/rental/utils'
import { ManaField } from '../../../ManaField'
import { Props } from './CreateOrEditListingStep.types'
import styles from './CreateOrEditListingStep.module.css'

const RENTAL_MIN_PRICE = 1

const CreateListingStep = (props: Props) => {
  const {
    onCancel,
    nft,
    onCreate,
    onRemove,
    rental,
    isListForRentAgain
  } = props

  // Editing properties
  const oldPrice = useMemo(
    () =>
      rental ? ethers.utils.formatEther(getMaxPriceOfPeriods(rental)) : null,
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
      rental && !isListForRentAgain
        ? convertDateToDateInputValue(new Date(rental.expiration))
        : null,
    [rental, isListForRentAgain]
  )

  // Form values
  const [pricePerDayInput, setPricePerDayInput] = useState(oldPrice ?? '')
  const [periodOptions, setPeriodOptions] = useState<PeriodOption[]>(
    oldPeriods ?? []
  )
  const [expiresAt, setExpiresAt] = useState(
    oldExpirationDate ?? getDefaultExpirationDate()
  )

  const fixedPriceInput = useMemo(() => toFixedMANAValue(pricePerDayInput), [
    pricePerDayInput
  ])

  // Checks if the new and the old price are the same by converting them
  // and checking their integer and floating point parts.
  const isOldNumberTheSameAsTheNewOne = useMemo(() => {
    // Converts the input to a number to parse partial inputs E.g: 3.
    const priceAsNumber = Number(fixedPriceInput)
    if (Number.isNaN(priceAsNumber)) {
      return false
    }

    // Converts the number to Wei and then converts it back to ethers to have
    // the same value as the old price one.
    const priceInWei = ethers.utils.parseEther(priceAsNumber.toString())
    return (
      ethers.utils.formatEther(priceInWei).toString() ===
      toFixedMANAValue(oldPrice ?? '')
    )
  }, [oldPrice, fixedPriceInput])

  // Handlers
  const handleSubmit = useCallback(() => {
    onCreate(
      nft,
      parseMANANumber(pricePerDayInput),
      periodOptions,
      Number(new Date(`${expiresAt} 00:00:00`)),
      UpsertRentalOptType.EDIT
    )
  }, [onCreate, nft, pricePerDayInput, periodOptions, expiresAt])

  const handleRemove = useCallback(() => onRemove(nft), [nft, onRemove])

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
  const parsedPriceInput = useMemo(() => parseMANANumber(pricePerDayInput), [
    pricePerDayInput
  ])
  const isInvalidPrice = parsedPriceInput < 0 || Number(pricePerDayInput) < 0
  const isLessThanMinPrice = parsedPriceInput < RENTAL_MIN_PRICE
  const isInvalidExpirationDate =
    new Date(`${expiresAt} 00:00:00`).getTime() < Date.now()
  const isInvalid =
    isInvalidPrice ||
    isInvalidExpirationDate ||
    periodOptions.length === 0 ||
    isLessThanMinPrice
  const showInvalidPriceError =
    pricePerDayInput !== '' && (isInvalidPrice || isLessThanMinPrice)
  const isUpdated =
    oldExpirationDate !== expiresAt ||
    !isOldNumberTheSameAsTheNewOne ||
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
    <>
      <ModalNavigation
        title={
          isListForRentAgain
            ? t('rental_modal.authorization_step_again.title')
            : rental
            ? t('rental_modal.create_listing_step.titles.edit')
            : t('rental_modal.create_listing_step.titles.create')
        }
        onClose={onCancel}
      />
      <Modal.Content>
        {rental && !isListForRentAgain ? (
          <div className={styles.editingCostWarning}>
            {t('rental_modal.create_listing_step.editing_cost_warning')}
          </div>
        ) : null}
        <div className={styles.pricePerDay}>
          <ManaField
            type="text"
            label={t('rental_modal.create_listing_step.price_per_day')}
            maxLength={20}
            placeholder={1000}
            network={nft.network}
            autoFocus
            value={fixedPriceInput}
            error={showInvalidPriceError}
            onChange={handlePriceChange}
            message={
              isLessThanMinPrice
                ? t('rental_modal.create_listing_step.less_than_min_price')
                : isInvalidPrice
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
          <Popup
            className={styles.periodsTooltip}
            content={t(
              'rental_modal.create_listing_step.expiration_date_tooltip'
            )}
            trigger={
              <i
                className={
                  rental && !isListForRentAgain ? styles.editInfo : styles.info
                }
              />
            }
            position="top center"
            on="hover"
          ></Popup>
        </div>
      </Modal.Content>
      <Modal.Actions className={styles.actions}>
        {!rental ? (
          <Button
            primary
            onClick={handleSubmit}
            disabled={isInvalid}
            className={styles.actionButton}
          >
            {t('rental_modal.create_listing_step.put_for_rent')}
          </Button>
        ) : (
          <>
            <Button
              className={styles.actionButton}
              primary
              onClick={handleSubmit}
              disabled={isInvalid || !isUpdated}
            >
              {isListForRentAgain
                ? t('rental_modal.authorization_step_again.title')
                : t('rental_modal.create_listing_step.update_listing')}
            </Button>
            <Button
              className={styles.actionButton}
              secondary
              onClick={handleRemove}
            >
              {isListForRentAgain
                ? t('global.cancel')
                : t('rental_modal.create_listing_step.remove_listing')}
            </Button>
          </>
        )}
      </Modal.Actions>
    </>
  )
}

export default React.memo(CreateListingStep)
