import { connect } from 'react-redux'
import React, { useCallback, useState } from 'react'
import { ethers } from 'ethers'
import { Authorization } from 'decentraland-dapps/dist/modules/authorization/types'
import { getData as getAuthorizations } from 'decentraland-dapps/dist/modules/authorization/selectors'
import {
  hasAuthorization,
  hasAuthorizationAndEnoughAllowance
} from 'decentraland-dapps/dist/modules/authorization/utils'
import { RootState } from '../../../modules/reducer'
import {
  AuthorizationAction,
  AuthorizationModal,
  Props as AuthorizationModalProps
} from './AuthorizationModal'
import { WithAuthorizedActionProps, MapStateProps } from './withAuthorizedAction.types'

const mapState = (state: RootState): MapStateProps => ({
  authorizations: getAuthorizations(state)
})

export default function withAuthorizedAction<P extends WithAuthorizedActionProps>(
  WrappedComponent: React.ComponentType<P>,
  action: AuthorizationAction
): React.ComponentType<Omit<P, keyof WithAuthorizedActionProps>> {


  // TODO: Remove any type
  const WithAutorizedActionComponent = (props: MapStateProps & any) => {
    const [showAuthorizationModal, setShowAuthorizationModal] = useState(false)
    const [authModalData, setAuthModalData] = useState<
      Omit<AuthorizationModalProps, 'onClose'>
    >()

    const handleAuthorizedAction = (
      authorization: Authorization,
      requiredAllowanceInWei: string,
      onAuthorized: () => void
    ) => {
      const { authorizations } = props
  
      const hasNeededAllowance = hasAuthorizationAndEnoughAllowance(
        authorizations,
        authorization,
        requiredAllowanceInWei
      )
    
      if (hasNeededAllowance || !requiredAllowanceInWei) {
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
        action,
        shouldAuthorize: !hasNeededAuthorization,
        shouldUpdateAllowance: hasNeededAuthorization && !hasNeededAllowance
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
        />
        {showAuthorizationModal && authModalData ? (
          <AuthorizationModal onClose={handleClose} {...authModalData} />
        ) : null}
      </>
    )
  }
  return connect(mapState)(WithAutorizedActionComponent)
}
