import { connect } from 'react-redux'
import React, { ComponentProps, useCallback, useState } from 'react'
import { BigNumber, ethers } from 'ethers'
import { Authorization, AuthorizationType } from 'decentraland-dapps/dist/modules/authorization/types'
import { getData as getAuthorizations } from 'decentraland-dapps/dist/modules/authorization/selectors'
import { fetchAuthorizationsRequest } from 'decentraland-dapps/dist/modules/authorization/actions'
import {
  hasAuthorization,
  hasAuthorizationAndEnoughAllowance
} from 'decentraland-dapps/dist/modules/authorization/utils'
import { RootState } from '../../../modules/reducer'
import {
  AuthorizationModal,
  AuthorizationStepStatus,
  AuthorizedAction
} from './AuthorizationModal'
import { WithAuthorizedActionProps, MapStateProps, MapDispatch, MapDispatchProps } from './withAuthorizedAction.types'

const mapState = (state: RootState): MapStateProps => ({
  authorizations: getAuthorizations(state)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onFetchAuthorizations: (authorizations: Authorization[]) =>
    dispatch(fetchAuthorizationsRequest(authorizations))
})

export default function withAuthorizedAction<P extends WithAuthorizedActionProps>(
  WrappedComponent: React.ComponentType<P>,
  action: AuthorizedAction
): React.ComponentType<Omit<P, keyof WithAuthorizedActionProps>> {

  // TODO: Remove any type
  const WithAutorizedActionComponent = (props: MapStateProps & MapDispatchProps & any) => {
    const [showAuthorizationModal, setShowAuthorizationModal] = useState(false)
    const [authModalData, setAuthModalData] = useState<
      Omit<ComponentProps<typeof AuthorizationModal>, 'onClose'>
    >()
    const [authorization, setAuthorization] = useState<Authorization>();
    const { onFetchAuthorizations } = props

    const handleSetAuthorization = useCallback((newAuthorization: Authorization) => {
      setAuthorization(newAuthorization)
      onFetchAuthorizations([newAuthorization])
    }, [onFetchAuthorizations])
  
    const handleAuthorizedAction = (
      requiredAllowanceInWei: string,
      onAuthorized: () => void
    ) => {
      const { authorizations } = props

      if (!authorization) {
        console.error("Authorization is missing. Set authorization value with onSetAuthorization prop in wrapped component")
        return;
      }
  
      const hasNeededAllowance = hasAuthorizationAndEnoughAllowance(
        authorizations,
        authorization,
        requiredAllowanceInWei
      )
    
      if (hasNeededAllowance || !requiredAllowanceInWei || BigNumber.from(requiredAllowanceInWei).isZero()) {
        onAuthorized()
        return
      }

      const hasNeededAuthorization = hasAuthorization(
        authorizations,
        authorization
      )

      setAuthModalData({
        authorization,
        requiredAllowance: ethers.utils.formatEther(requiredAllowanceInWei),
        authorizationType: !hasNeededAuthorization ? AuthorizationType.APPROVAL : AuthorizationType.ALLOWANCE,
        action,
        onAuthorized
      })
      setShowAuthorizationModal(true)
    }

    const handleClose = useCallback(() => {
      setShowAuthorizationModal(false)
    }, [])

    return (
      <>
        <WrappedComponent
          {...props}
          onAuthorizedAction={handleAuthorizedAction}
          onSetAuthorization={handleSetAuthorization}
        />
        {showAuthorizationModal && authModalData ? (
          <AuthorizationModal onClose={handleClose} {...authModalData} />
        ) : null}
      </>
    )
  }
  return connect(mapState, mapDispatch)(WithAutorizedActionComponent)
}
