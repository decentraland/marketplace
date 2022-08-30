import React, { useCallback, useMemo, useState } from 'react'
import { Button } from 'decentraland-ui'
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
import { CreateListingStep } from './CreateListingStep'

const RentalModal = (props: Props) => {
  // Props
  const { open, address, nft, authorizations, onCancel, onCreate } = props

  // State
  const [listing, setListing] = useState<CreateRentalRequestAction['payload']>()

  // Handlers
  const handleSetListing = useCallback<
    (...params: Parameters<typeof createRentalRequest>) => void
  >(
    (nft, pricePerDay, periods, expiresAt) => {
      setListing({ nft, pricePerDay, periods, expiresAt })
    },
    [setListing]
  )

  const handleConfirm = useCallback(() => {
    if (listing) {
      const { nft, pricePerDay, periods, expiresAt } = listing
      onCreate(nft, pricePerDay, periods, expiresAt)
    }
  }, [listing, onCreate])

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
      <CreateListingStep
        open={open}
        nft={nft}
        onCreate={handleSetListing}
        onCancel={onCancel}
      />
    )
  }

  // Confirmation step
  return <Button onClick={handleConfirm}>DO IT</Button>
}

export default React.memo(RentalModal)
