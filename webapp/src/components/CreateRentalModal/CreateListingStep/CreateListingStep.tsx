import React, { useCallback, useState } from 'react'
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
import { ManaField } from '../../ManaField'
import { parseMANANumber } from '../../../lib/mana'
import { getDefaultExpirationDate } from '../../../modules/order/utils'
import { daysByPeriod } from '../../../modules/rental/utils'
import { Props } from './CreateListingStep.types'
import styles from './CreateListingStep.module.css'

const CreateListingStep = (props: Props) => {
  const { open, onCancel, nft, onCreate } = props

  const [pricePerDayInput, setPricePerDayInput] = useState('')
  const [periodOptions, setPeriodOptions] = useState<PeriodOption[]>([])
  const [expiresAt, setExpiresAt] = useState(getDefaultExpirationDate())

  const handleSubmit = useCallback(() => {
    onCreate(
      nft,
      parseMANANumber(pricePerDayInput),
      periodOptions,
      Number(new Date(expiresAt))
    )
  }, [onCreate, nft, pricePerDayInput, periodOptions, expiresAt])

  const createOptionHanlder = (periodOption: PeriodOption) => () => {
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

  // validation
  const isInvalidPrice = parseMANANumber(pricePerDayInput) <= 0
  const isInvalidExpirationDate = new Date(expiresAt).getTime() < Date.now()
  const isInvalid =
    isInvalidPrice || isInvalidExpirationDate || periodOptions.length === 0
  const showInvalidPriceError = pricePerDayInput !== '' && isInvalidPrice

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
        title={t('rental_modal.create_listing_step.title')}
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
                onClick={createOptionHanlder(option)}
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
      <Modal.Actions>
        <Button primary onClick={handleSubmit} disabled={isInvalid}>
          {t('rental_modal.create_listing_step.put_for_rent')}
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

export default React.memo(CreateListingStep)
