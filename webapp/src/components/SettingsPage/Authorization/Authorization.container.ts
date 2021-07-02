import { connect } from 'react-redux'
import {
  getData as getAuthorizations,
  getLoading
} from 'decentraland-dapps/dist/modules/authorization/selectors'
import {
  GrantTokenRequestAction,
  GRANT_TOKEN_REQUEST,
  RevokeTokenRequestAction,
  REVOKE_TOKEN_REQUEST,
  grantTokenRequest,
  revokeTokenRequest
} from 'decentraland-dapps/dist/modules/authorization/actions'
import { areEqual } from 'decentraland-dapps/dist/modules/authorization/utils'
import { hasTransactionPending } from '../../../modules/transaction/utils'
import { RootState } from '../../../modules/reducer'
import { getPendingAuthorizationTransactions } from '../../../modules/transaction/selectors'
import {
  OwnProps,
  MapStateProps,
  MapDispatchProps,
  MapDispatch
} from './Authorization.types'
import Authorization from './Authorization'

const mapState = (
  state: RootState,
  { authorization }: OwnProps
): MapStateProps => {
  const { contractAddress, authorizedAddress } = authorization

  const authorizations = getAuthorizations(state)
  const pendingTransactions = getPendingAuthorizationTransactions(state)

  const isLoading = getLoading(state).some(action => {
    if (
      action.type === GRANT_TOKEN_REQUEST ||
      action.type === REVOKE_TOKEN_REQUEST
    ) {
      const { payload } = action as
        | GrantTokenRequestAction
        | RevokeTokenRequestAction
      return areEqual(authorization, payload.authorization)
    }
    return false
  })

  return {
    authorizations,
    pendingTransactions,
    isLoading:
      isLoading ||
      hasTransactionPending(
        pendingTransactions,
        authorizedAddress,
        contractAddress
      )
  }
}

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onGrant: authorization => dispatch(grantTokenRequest(authorization)),
  onRevoke: authorization => dispatch(revokeTokenRequest(authorization))
})

export default connect(mapState, mapDispatch)(Authorization)
