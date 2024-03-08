import React, { useCallback, useState } from 'react'
import { ethers } from 'ethers'
import { Contract } from '@dcl/schemas'
import { isAddress } from 'ethers/lib/utils'
import add from 'date-fns/add'
import format from 'date-fns/format'
import { ModalNavigation, Message, Loader, Button, Field, Checkbox } from 'decentraland-ui'
import { T, t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Modal, withAuthorizedAction } from 'decentraland-dapps/dist/containers'
import { ContractName } from 'decentraland-transactions'
import { AuthorizationType } from 'decentraland-dapps/dist/modules/authorization/types'
import { AuthorizedAction } from 'decentraland-dapps/dist/containers/withAuthorizedAction/AuthorizationModal'
import { formatWeiMANA } from '../../../lib/mana'
import { getContractNames } from '../../../modules/vendor'
import { getRentConfirmationStatus, getError } from '../../../modules/rental/selectors'
import { Mana } from '../../Mana'
import { ManaField } from '../../ManaField'
import { Props } from './ConfirmRentModal.types'
import styles from './ConfirmRentModal.module.css'

const ConfirmRentModal = ({
  wallet,
  metadata: { nft, rental, selectedPeriodIndex },
  onClose,
  isSubmittingTransaction,
  isTransactionBeingConfirmed,
  onSubmitTransaction,
  onAuthorizedAction,
  getContract,
  isLoadingAuthorization,
  onClearRentalErrors,
  error
}: Props) => {
  const [operatorAddress, setOperatorAddress] = useState(wallet?.address)
  const [isUserTheOperatorAddress, setIsUserTheOperatorAddress] = useState(true)
  const isLoading = isTransactionBeingConfirmed || isSubmittingTransaction || isLoadingAuthorization
  const [price, setPrice] = useState<string>()
  const startDate = new Date()
  const period = rental.periods[selectedPeriodIndex]
  const endDate = add(startDate, { days: period.maxDays })
  const pricePerRent = ethers.BigNumber.from(period.pricePerDay).mul(period.maxDays).toString()
  const pricePerRentInEther = Number(ethers.utils.formatEther(pricePerRent))
  const formattedPricePerRent = formatWeiMANA(pricePerRent)

  const contractNames = getContractNames()
  const mana = getContract({
    name: contractNames.MANA,
    network: nft.network
  })
  const rentals = getContract({
    name: contractNames.RENTALS,
    network: nft.network
  })

  const handleOperatorToggle = useCallback(() => {
    if (isUserTheOperatorAddress) {
      setOperatorAddress('')
    } else {
      setOperatorAddress(wallet!.address)
    }
    setIsUserTheOperatorAddress(!isUserTheOperatorAddress)
  }, [isUserTheOperatorAddress, wallet, setIsUserTheOperatorAddress])

  const hasAnInvalidOperator =
    !operatorAddress || (!!operatorAddress && !isAddress(operatorAddress)) || operatorAddress === ethers.constants.AddressZero

  const handleSubmit = useCallback(() => {
    if (operatorAddress && mana && rentals) {
      onClearRentalErrors()
      onAuthorizedAction({
        targetContractName: ContractName.MANAToken,
        authorizedAddress: rentals.address,
        targetContract: mana as Contract,
        authorizationType: AuthorizationType.ALLOWANCE,
        requiredAllowanceInWei: pricePerRent,
        authorizedContractLabel: rentals.label || rentals.name,
        onAuthorized: () => onSubmitTransaction(operatorAddress)
      })
    }
  }, [operatorAddress, pricePerRent, rentals, mana, onAuthorizedAction, onSubmitTransaction, onClearRentalErrors])

  return (
    <Modal
      size="small"
      className={styles.modal}
      name={t('rental_modal.confirm_rent_step.title')}
      onClose={!isLoading ? onClose : undefined}
    >
      <ModalNavigation title={t('rental_modal.confirm_rent_step.title')} onClose={!isLoading ? onClose : undefined} />
      <Modal.Content>
        <span>
          <T
            id={'rental_modal.confirm_rent_step.subtitle'}
            values={{
              land_name: <b>{nft.name}</b>,
              duration: <b>{rental.periods[selectedPeriodIndex].maxDays}</b>,
              start_date: format(startDate, 'MMM dd'),
              end_date: format(endDate, 'MMM dd'),
              price: <Mana>{formattedPricePerRent}</Mana>
            }}
          />
        </span>

        <div className={styles.priceContainer}>
          <ManaField
            network={nft.network}
            disabled={isLoading}
            label={t('bid_page.price')}
            placeholder={pricePerRentInEther}
            value={price}
            onChange={(_event, props) => {
              setPrice(props.value)
            }}
          />
        </div>

        <div>
          <Field
            label={t('rental_modal.confirm_rent_step.operator_address')}
            value={operatorAddress}
            disabled={isUserTheOperatorAddress || isLoading}
            onChange={(_event, props) => {
              setOperatorAddress(props.value)
            }}
            error={hasAnInvalidOperator}
            message={hasAnInvalidOperator ? t('rental_modal.confirm_rent_step.wrong_operator') : undefined}
          />
          <div className={styles.operatorCheckboxContainer}>
            <Checkbox checked={isUserTheOperatorAddress} disabled={isLoading} onChange={handleOperatorToggle} />
            <span className={styles.operatorFieldNotice}>{t('rental_modal.confirm_rent_step.operator_notice')}</span>
          </div>
        </div>

        {error ? <Message error size="tiny" visible content={error} header={t('global.error')} /> : null}
      </Modal.Content>
      <Modal.Actions className={styles.actions}>
        <Button className={styles.cancel} secondary disabled={isLoading} onClick={onClose}>
          {t('global.cancel')}
        </Button>
        {isLoading ? (
          <div className={styles.loader}>
            <Loader inline size="small" />
            {isSubmittingTransaction ? (
              <span className={styles.signMessage}>{t('rental_modal.confirm_rent_step.confirm_transaction')}</span>
            ) : null}
          </div>
        ) : (
          <Button
            className={styles.cancel}
            primary
            disabled={Number(price) !== pricePerRentInEther || hasAnInvalidOperator || isLoading}
            onClick={handleSubmit}
          >
            {t('global.confirm')}
          </Button>
        )}
      </Modal.Actions>
    </Modal>
  )
}

export default React.memo(
  withAuthorizedAction(
    ConfirmRentModal,
    AuthorizedAction.RENT,
    {
      action: 'rental_modal.authorization.action',
      title_action: 'rental_modal.authorization.title_action'
    },
    getRentConfirmationStatus,
    getError
  )
)
