import React, { useCallback, useMemo, useState } from 'react'
import classNames from 'classnames'
import {
  Authorization,
  AuthorizationType
} from 'decentraland-dapps/dist/modules/authorization/types'
import { hasAuthorization } from 'decentraland-dapps/dist/modules/authorization/utils'
import { Modal } from 'decentraland-dapps/dist/containers'
import { ContractName, getContract } from 'decentraland-transactions'
import {
  canBeClaimed,
  isRentalListingOpen
} from '../../../modules/rental/utils'
import {
  upsertRentalRequest,
  UpsertRentalRequestAction
} from '../../../modules/rental/actions'
import { Props } from './RentalListingModal.types'
import { AuthorizationStep } from './AuthorizationStep'
import { CreateOrEditListingStep } from './CreateOrEditListingStep'
import { EditConfirmationStep } from './EditConfirmationStep'
import { ConfirmationStep } from './ConfirmationStep'
import styles from './RentalListingModal.module.css'
import InformationStep from './InformationStep/InformationStep'

const RentalListingModal = (props: Props) => {
  const {
    address,
    metadata: { nft, rental },
    authorizations,
    onRemove,
    onClose,
    wallet
  } = props

  const [listing, setListing] = useState<
    UpsertRentalRequestAction['payload'] | null
  >(null)

  const handleSetListing = useCallback<
    (...params: Parameters<typeof upsertRentalRequest>) => void
  >(
    (nft, pricePerDay, periods, expiresAt, operationType) => {
      setListing({ nft, pricePerDay, periods, expiresAt, operationType })
    },
    [setListing]
  )

  const handleCancel = useCallback(() => {
    if (listing) {
      setListing(null)
    }
  }, [listing, setListing])

  // Authorization step
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

  const isConfirmingEditingStep = useMemo(() => !!listing && !!rental, [
    listing,
    rental
  ])

  const isListForRentAgain =
    wallet &&
    rental &&
    canBeClaimed(wallet.address, rental, nft) &&
    !isRentalListingOpen(rental)

  const [
    listForRentAgainAuthorizationStep,
    setListForRentAgainAuthorizationStep
  ] = useState(isListForRentAgain)

  return (
    <Modal
      size="tiny"
      className={classNames(
        styles.modal,
        isConfirmingEditingStep && styles.editingModal
      )}
      onClose={() => undefined}
    >
      {!isAuthorized ? (
        <AuthorizationStep nft={nft} onCancel={onClose} />
      ) : listForRentAgainAuthorizationStep ? (
        <InformationStep
          nft={nft}
          onCancel={onClose}
          handleSubmit={() => setListForRentAgainAuthorizationStep(false)}
        />
      ) : !listing ? (
        <CreateOrEditListingStep
          nft={nft}
          rental={
            isRentalListingOpen(rental) || isListForRentAgain ? rental : null
          }
          onCreate={handleSetListing}
          onRemove={isListForRentAgain ? onClose : onRemove}
          onCancel={onClose}
          isListForRentAgain={isListForRentAgain}
        />
      ) : rental && isRentalListingOpen(rental) ? (
        <EditConfirmationStep
          rental={rental}
          onCancel={handleCancel}
          {...listing}
        />
      ) : (
        <ConfirmationStep onCancel={handleCancel} {...listing} />
      )}
    </Modal>
  )
}

export default React.memo(RentalListingModal)
