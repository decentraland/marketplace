import { connect } from 'react-redux'
import {
  GrantTokenRequestAction,
  GRANT_TOKEN_REQUEST,
  RevokeTokenRequestAction,
  REVOKE_TOKEN_REQUEST,
  grantTokenRequest,
  revokeTokenRequest
} from 'decentraland-dapps/dist/modules/authorization/actions'
import { getData as getAuthorizations, getLoading } from 'decentraland-dapps/dist/modules/authorization/selectors'
import { areEqual } from 'decentraland-dapps/dist/modules/authorization/utils'
import { getContract } from '../../../modules/contract/selectors'
import { RootState } from '../../../modules/reducer'
import { getPendingAuthorizationTransactions } from '../../../modules/transaction/selectors'
import { hasTransactionPending } from '../../../modules/transaction/utils'
import { Contract } from '../../../modules/vendor/services'
import Authorization from './Authorization'
import { OwnProps, MapStateProps, MapDispatchProps, MapDispatch } from './Authorization.types'

const mapState = (state: RootState, { authorization }: OwnProps): MapStateProps => {
  const { contractAddress, authorizedAddress } = authorization

  const authorizations = getAuthorizations(state)
  const pendingTransactions = getPendingAuthorizationTransactions(state)

  const isLoading = getLoading(state).some(action => {
    if (action.type === GRANT_TOKEN_REQUEST || action.type === REVOKE_TOKEN_REQUEST) {
      const { payload } = action as GrantTokenRequestAction | RevokeTokenRequestAction
      return areEqual(authorization, payload.authorization)
    }
    return false
  })

  return {
    authorizations,
    pendingTransactions,
    isLoading: isLoading || hasTransactionPending(pendingTransactions, authorizedAddress, contractAddress),
    getContract: (query: Partial<Contract>) => getContract(state, query)
  }
}

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onGrant: authorization => dispatch(grantTokenRequest(authorization)),
  onRevoke: authorization => dispatch(revokeTokenRequest(authorization))
})

export default connect(mapState, mapDispatch)(Authorization)
