import { connect } from 'react-redux'
import {
  grantTokenRequest,
  GRANT_TOKEN_REQUEST,
  revokeTokenRequest,
  REVOKE_TOKEN_REQUEST
} from 'decentraland-dapps/dist/modules/authorization/actions'
import { Authorization } from 'decentraland-dapps/dist/modules/authorization/types'
import {
  getError,
  getData as getAuthorizations
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
  const autorizations = getAuthorizations(state)
  return {
    revokeStatus: getStepStatus(
      state,
      REVOKE_TOKEN_REQUEST,
      authorization,
      autorizations,
      undefined
    ),
    grantStatus: getStepStatus(
      state,
      GRANT_TOKEN_REQUEST,
      authorization,
      autorizations,
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
    dispatch(grantTokenRequest(authorization))
})

export default connect(mapState, mapDispatch)(AuthorizationModal)
