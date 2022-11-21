import React, { useCallback, useMemo, useState } from 'react'
import classNames from 'classnames'
import {
  Authorization,
  AuthorizationType
} from 'decentraland-dapps/dist/modules/authorization/types'
import { hasAuthorization } from 'decentraland-dapps/dist/modules/authorization/utils'
import { Modal } from 'decentraland-dapps/dist/containers'
import { ContractName, getContract } from 'decentraland-transactions'
import { isRentalListingOpen } from '../../../modules/rental/utils'
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

const RentalListingModal = (props: Props) => {
  // Props
  const {
    address,
    metadata: { nft, rental },
    authorizations,
    onRemove,
    onClose
  } = props

  // State
  const [listing, setListing] = useState<
    UpsertRentalRequestAction['payload'] | null
  >(null)

  // Handlers
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

  return (
    <Modal
      size="tiny"
      className={classNames(
        styles.modal,
        isConfirmingEditingStep && styles.editingModal
      )}
      onClose={onClose}
    >
      {!isAuthorized ? (
        <AuthorizationStep nft={nft} onCancel={onClose} />
      ) : !listing ? (
        <CreateOrEditListingStep
          nft={nft}
          rental={rental}
          onCreate={handleSetListing}
          onRemove={onRemove}
          onCancel={onClose}
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
