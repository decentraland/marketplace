import React, { useCallback, useMemo, useState } from 'react'
import {
  Authorization,
  AuthorizationType
} from 'decentraland-dapps/dist/modules/authorization/types'
import { hasAuthorization } from 'decentraland-dapps/dist/modules/authorization/utils'
import { Modal } from 'decentraland-dapps/dist/containers'
import { ContractName, getContract } from 'decentraland-transactions'
import { Props } from './RentalListingModal.types'
import {
  createRentalRequest,
  CreateRentalRequestAction
} from '../../../modules/rental/actions'
import { AuthorizationStep } from './AuthorizationStep'
import { CreateOrEditListingStep } from './CreateOrEditListingStep'
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
    CreateRentalRequestAction['payload'] | null
  >(null)

  // Handlers
  const handleSetListing = useCallback<
    (...params: Parameters<typeof createRentalRequest>) => void
  >(
    (nft, pricePerDay, periods, expiresAt) => {
      setListing({ nft, pricePerDay, periods, expiresAt })
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

  return (
    <Modal size="tiny" className={styles.modal} onClose={onClose}>
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
      ) : (
        <ConfirmationStep {...listing} onCancel={handleCancel} />
      )}
    </Modal>
  )
}

export default React.memo(RentalListingModal)
