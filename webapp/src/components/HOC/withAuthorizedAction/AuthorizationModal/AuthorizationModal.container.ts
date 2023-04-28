import { connect } from 'react-redux'
import {
  fetchAuthorizationsRequest,
  grantTokenRequest,
  GRANT_TOKEN_REQUEST,
  revokeTokenRequest,
  REVOKE_TOKEN_REQUEST
} from 'decentraland-dapps/dist/modules/authorization/actions'
import { Authorization } from 'decentraland-dapps/dist/modules/authorization/types'
import {
  getError
} from 'decentraland-dapps/dist/modules/authorization/selectors'
import { RootState } from '../../../../modules/reducer'
import { AuthorizationModal } from './AuthorizationModal'
import {
  MapDispatch,
  MapDispatchProps,
  MapStateProps,
  OwnProps
} from './AuthorizationModal.types'
import { getStepStatus } from './utils'
import { getContract } from '../../../../modules/contract/selectors'
import { Contract } from '../../../../modules/vendor/services'

const mapState = (state: RootState, ownProps: OwnProps): MapStateProps => {
  const { authorization, requiredAllowance } = ownProps
  return {
    revokeStatus: getStepStatus(
      state,
      REVOKE_TOKEN_REQUEST,
      authorization,
      undefined
    ),
    grantStatus: getStepStatus(
      state,
      GRANT_TOKEN_REQUEST,
      authorization,
      requiredAllowance
    ),
    error: getError(state) || '',
    getContract: (query: Partial<Contract>) => getContract(state, query)
  }
}

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onRevoke: (authorization: Authorization) =>
    dispatch(revokeTokenRequest(authorization)),
  onGrant: (authorization: Authorization) =>
    dispatch(grantTokenRequest(authorization)),
  onFetchAuthorizations: (authorizations: Authorization[]) =>
    dispatch(fetchAuthorizationsRequest(authorizations))
})

export default connect(mapState, mapDispatch)(AuthorizationModal)
