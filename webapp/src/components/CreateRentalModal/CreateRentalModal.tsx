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
import {
  Authorization,
  AuthorizationType
} from 'decentraland-dapps/dist/modules/authorization/types'
import { hasAuthorization } from 'decentraland-dapps/dist/modules/authorization/utils'
import { ContractName, getContract } from 'decentraland-transactions'
import { TransactionLink } from 'decentraland-dapps/dist/containers'
import { T, t } from 'decentraland-dapps/dist/modules/translation/utils'
import { toFixedMANAValue } from 'decentraland-dapps/dist/lib/mana'
import { PeriodOption } from '../../modules/rental/types'
import { ManaField } from '../ManaField'
import { parseMANANumber } from '../../lib/mana'
import { getDefaultExpirationDate } from '../../modules/order/utils'
import { Props } from './CreateRentalModal.types'
import styles from './CreateRentalModal.module.css'

const CreateRentalModal = (props: Props) => {
  const {
    open,
    onCancel,
    address,
    isCreating,
    isGranting,
    nft,
    authorizations,
    onCreate,
    onGrant,
    error
  } = props
  const [pricePerDayInput, setPricePerDayInput] = useState('')
  const [periodOptions, setPeriodOptions] = useState<PeriodOption[]>([])
  const [expiresAt, setExpiresAt] = useState(getDefaultExpirationDate())

  const rentalContractData = getContract(ContractName.Rentals, nft.chainId)

  const authorization: Authorization = useMemo(
    () => ({
      address: address!,
      authorizedAddress: rentalContractData.address,
      contractAddress: nft.contractAddress,
      contractName: ContractName.ERC721,
      chainId: nft.chainId,
      type: AuthorizationType.APPROVAL
    }),
    [address, rentalContractData, nft]
  )

  const isAuthorized = hasAuthorization(authorizations, authorization)

  const handleSubmit = useCallback(() => {
    if (!isAuthorized) {
      onGrant(authorization)
    } else {
      onCreate(
        nft,
        parseMANANumber(pricePerDayInput),
        periodOptions,
        Number(new Date(expiresAt))
      )
    }
  }, [
    isAuthorized,
    onCreate,
    nft,
    pricePerDayInput,
    periodOptions,
    expiresAt,
    onGrant,
    authorization
  ])

  const createOptionHanlder = (periodOption: PeriodOption) => () => {
    const shouldAdd = !periodOptions.includes(periodOption)
    if (shouldAdd) {
      setPeriodOptions([...periodOptions, periodOption])
    } else {
      setPeriodOptions(periodOptions.filter(option => option !== periodOption))
    }
  }

  // validation
  const isInvalidPrice = parseMANANumber(pricePerDayInput) <= 0
  const isInvalidExpirationDate = new Date(expiresAt).getTime() < Date.now()

  const isInvalid =
    isInvalidPrice || isInvalidExpirationDate || periodOptions.length === 0

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
        title={t('create_rental_modal.title')}
        onClose={onCancel}
      />
      <Modal.Content>
        {isAuthorized ? (
          <>
            <ManaField
              label={t('create_rental_modal.price')}
              type="text"
              placeholder={1000}
              network={nft.network}
              value={pricePerDayInput}
              focus={true}
              error={pricePerDayInput !== '' && isInvalidPrice}
              onChange={handlePriceChange}
              message={
                pricePerDayInput !== '' && isInvalidPrice
                  ? t('create_rental_modal.invalid_price')
                  : undefined
              }
            />
            <Field
              label={t('create_rental_modal.expiration_date')}
              type="date"
              value={expiresAt}
              onChange={handleExpirationDateChange}
              error={isInvalidExpirationDate}
              message={
                isInvalidExpirationDate
                  ? t('create_rental_modal.invalid_date')
                  : undefined
              }
            />
            <div>
              <Header sub>
                {t('create_rental_modal.periods')}
                <Popup
                  className={styles.periodsTooltip}
                  content={t('create_rental_modal.periods_tooltip')}
                  trigger={<i className={styles.info} />}
                  position="top center"
                  on="hover"
                ></Popup>
              </Header>

              <div className={styles.periodOptions}>
                {Object.values(PeriodOption).map(option => (
                  <Radio
                    label={t(`create_rental_modal.period_options.${option}`)}
                    checked={periodOptions.includes(option)}
                    onClick={createOptionHanlder(option)}
                  />
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className={styles.notice}>
            <p>
              <T
                id="create_rental_modal.notice_line_one"
                values={{
                  link: (
                    <TransactionLink
                      address={rentalContractData.address}
                      txHash=""
                      chainId={rentalContractData.chainId}
                    >
                      {t('create_rental_modal.notice_link')}
                    </TransactionLink>
                  )
                }}
              ></T>
            </p>
            <p>
              <T id="create_rental_modal.notice_line_two" />
            </p>
          </div>
        )}
      </Modal.Content>
      <Modal.Actions>
        <Button
          primary
          loading={isCreating || isGranting}
          onClick={handleSubmit}
          disabled={isGranting || (isAuthorized && (isInvalid || isCreating))}
        >
          {isAuthorized
            ? t('create_rental_modal.put_for_rent')
            : t('global.proceed')}
        </Button>
      </Modal.Actions>

      {isAuthorized && error && (
        <Modal.Content className={styles.error}>{error}</Modal.Content>
      )}
    </Modal>
  )
}

export default React.memo(CreateRentalModal)
