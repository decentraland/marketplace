import { connect } from 'react-redux'
import React, { ComponentProps, useCallback, useState } from 'react'
import { BigNumber, ethers } from 'ethers'
import {
  Authorization,
  AuthorizationType
} from 'decentraland-dapps/dist/modules/authorization/types'
import { getNetworkProvider } from 'decentraland-dapps/dist/lib/eth'
import { RootState } from '../../../modules/reducer'
import { getWallet } from '../../../modules/wallet/selectors'
import { AuthorizationModal, AuthorizedAction } from './AuthorizationModal'
import {
  WithAuthorizedActionProps,
  MapStateProps,
  AuthorizeActionOptions
} from './withAuthorizedAction.types'
import { getERC20ContractInstance, getERC721ContractInstance } from './utils'

const mapState = (state: RootState): MapStateProps => ({
  wallet: getWallet(state)
})

export default function withAuthorizedAction<
  P extends WithAuthorizedActionProps
>(
  WrappedComponent: React.ComponentType<P>,
  action: AuthorizedAction
): React.ComponentType<Omit<P, keyof WithAuthorizedActionProps>> {
  // TODO: Remove any type
  const WithAutorizedActionComponent = (props: MapStateProps & any) => {
    const [showAuthorizationModal, setShowAuthorizationModal] = useState(false)
    const [authModalData, setAuthModalData] = useState<
      Omit<ComponentProps<typeof AuthorizationModal>, 'onClose'>
    >()
    const [isLoadingAuthorization, setIsLoadingAuthorization] = useState(false)
    const { wallet } = props

    const handleAuthorizedAction = async (
      authorizeOptions: AuthorizeActionOptions
    ) => {
      if (!wallet) {
        return
      }

      setIsLoadingAuthorization(true)

      const {
        authorizationType,
        targetContract,
        authorizedAddress,
        targetContractName,
        onAuthorized
      } = authorizeOptions

      const networkProvider = await getNetworkProvider(targetContract.chainId)
      const provider = new ethers.providers.Web3Provider(networkProvider)

      const authorization: Authorization = {
        type: authorizationType,
        address: wallet.address,
        authorizedAddress,
        contractAddress: targetContract.address,
        chainId: targetContract.chainId,
        contractName: targetContractName
      }

      try {
        if (authorizationType === AuthorizationType.ALLOWANCE) {
          const { requiredAllowanceInWei } = authorizeOptions
          if (BigNumber.from(requiredAllowanceInWei).isZero()) {
            onAuthorized()
            return
          }

          const contract = getERC20ContractInstance(
            targetContract.address,
            provider
          )
          const allowance: BigNumber = await contract.allowance(
            wallet.address,
            authorizedAddress
          )

          if (allowance.gte(BigNumber.from(requiredAllowanceInWei))) {
            onAuthorized()
            setIsLoadingAuthorization(false)
            return
          }

          setAuthModalData({
            authorization,
            currentAllowance: allowance,
            requiredAllowance: BigNumber.from(requiredAllowanceInWei),
            authorizationType: authorizationType,
            action,
            network: targetContract.network,
            onAuthorized
          })
        } else {
          const contract = getERC721ContractInstance(
            targetContract.address,
            provider
          )
          const isApprovedForAll = await contract.isApprovedForAll(
            wallet.address,
            authorizedAddress
          )

          if (isApprovedForAll) {
            onAuthorized()
            setIsLoadingAuthorization(false)
            return
          }

          setAuthModalData({
            authorization,
            authorizationType: authorizationType,
            action,
            network: targetContract.network,
            onAuthorized
          })
        }
        setShowAuthorizationModal(true)
      } catch (error) {
        // TODO: handle error scenario
        console.error(error)
      }
    }

    const handleClose = useCallback(() => {
      setIsLoadingAuthorization(false)
      setShowAuthorizationModal(false)
    }, [])

    return (
      <>
        <WrappedComponent
          {...props}
          onAuthorizedAction={handleAuthorizedAction}
          isLoadingAuthorization={isLoadingAuthorization}
        />
        {showAuthorizationModal && authModalData ? (
          <AuthorizationModal onClose={handleClose} {...authModalData} />
        ) : null}
      </>
    )
  }
  return connect(mapState)(WithAutorizedActionComponent)
}
