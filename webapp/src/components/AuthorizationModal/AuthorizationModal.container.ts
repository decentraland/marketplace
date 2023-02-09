import { connect } from 'react-redux'
import {
  fetchAuthorizationsRequest,
  GRANT_TOKEN_REQUEST,
  REVOKE_TOKEN_REQUEST
} from 'decentraland-dapps/dist/modules/authorization/actions'
import { getData as getAuthorizations, getLoading } from 'decentraland-dapps/dist/modules/authorization/selectors'
import { Authorization } from 'decentraland-dapps/dist/modules/authorization/types'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { upsertContracts } from '../../modules/contract/actions'
import { getContract } from '../../modules/contract/selectors'
import { RootState } from '../../modules/reducer'
import { Contract } from '../../modules/vendor/services'
import AuthorizationModal from './AuthorizationModal'
import { MapStateProps, MapDispatchProps, MapDispatch } from './AuthorizationModal.types'

const mapState = (state: RootState): MapStateProps => ({
  authorizations: getAuthorizations(state),
  isAuthorizing: isLoadingType(getLoading(state), GRANT_TOKEN_REQUEST) || isLoadingType(getLoading(state), REVOKE_TOKEN_REQUEST),
  getContract: (query: Partial<Contract>) => getContract(state, query)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onFetchAuthorizations: (authorizations: Authorization[]) => dispatch(fetchAuthorizationsRequest(authorizations)),
  onUpsertContracts: (contracts: Contract[]) => dispatch(upsertContracts(contracts))
})

export default connect(mapState, mapDispatch)(AuthorizationModal)
