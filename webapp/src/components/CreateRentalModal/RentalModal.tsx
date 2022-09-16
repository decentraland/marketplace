import React, { useCallback, useMemo, useState } from 'react'
import {
  Authorization,
  AuthorizationType
} from 'decentraland-dapps/dist/modules/authorization/types'
import { hasAuthorization } from 'decentraland-dapps/dist/modules/authorization/utils'
import { ContractName, getContract } from 'decentraland-transactions'
import { Props } from './RentalModal.types'
import {
  createRentalRequest,
  CreateRentalRequestAction
} from '../../modules/rental/actions'
import { AuthorizationStep } from './AuthorizationStep'
import { CreateOrEditListingStep } from './CreateOrEditListingStep'
import { ConfirmationStep } from './ConfirmationStep'

const RentalModal = (props: Props) => {
  // Props
  const { open, address, nft, rental, authorizations, onCancel } = props

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

  if (!isAuthorized) {
    return <AuthorizationStep open={open} nft={nft} onCancel={onCancel} />
  }

  // Create listing step
  if (!listing) {
    return (
      <CreateOrEditListingStep
        open={open}
        nft={nft}
        rental={rental}
        onCreate={handleSetListing}
        onCancel={onCancel}
      />
    )
  }

  // Confirmation step
  return <ConfirmationStep open={open} {...listing} onCancel={handleCancel} />
}

export default React.memo(RentalModal)
