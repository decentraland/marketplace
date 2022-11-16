import React, { useCallback, useMemo, useState } from 'react'
import { Env } from '@dcl/ui-env'
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
import { config } from '../../../../config'
import {
  PeriodOption,
  PeriodOptionsDev,
  UpsertRentalOptType
} from '../../../../modules/rental/types'
import { formatWeiMANA, parseMANANumber } from '../../../../lib/mana'
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

const isDev = config.is(Env.DEVELOPMENT) || config.is(Env.STAGING)
const RENTAL_MIN_PRICE = 1

const CreateListingStep = (props: Props) => {
  const { onCancel, nft, onCreate, onRemove, rental } = props

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
      Number(new Date(expiresAt)),
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
  const parsedPriceInput = parseMANANumber(pricePerDayInput)
  const isInvalidPrice = parsedPriceInput < 0 || Number(pricePerDayInput) < 0
  const isLessThanMinPrice = parsedPriceInput < RENTAL_MIN_PRICE
  const isInvalidExpirationDate = new Date(expiresAt).getTime() < Date.now()
  const isInvalid =
    isInvalidPrice ||
    isInvalidExpirationDate ||
    periodOptions.length === 0 ||
    isLessThanMinPrice
  const showInvalidPriceError =
    pricePerDayInput !== '' && (isInvalidPrice || isLessThanMinPrice)
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
    <>
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
            {Object.values(isDev ? PeriodOptionsDev : PeriodOption).map(
              option => (
                <Radio
                  key={option}
                  label={t(
                    `rental_modal.create_listing_step.period_options.${option}`
                  )}
                  checked={periodOptions.includes(option)}
                  onClick={createOptionHandler(option)}
                />
              )
            )}
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
            <Button secondary onClick={handleRemove}>
              {t('rental_modal.create_listing_step.remove_listing')}
            </Button>
          </>
        )}
      </Modal.Actions>
    </>
  )
}

export default React.memo(CreateListingStep)
