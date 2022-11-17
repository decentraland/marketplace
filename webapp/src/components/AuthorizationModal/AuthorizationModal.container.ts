import { connect } from 'react-redux'
import {
  GRANT_TOKEN_REQUEST,
  REVOKE_TOKEN_REQUEST
} from 'decentraland-dapps/dist/modules/authorization/actions'
import { getData as getAuthorizations } from 'decentraland-dapps/dist/modules/authorization/selectors'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { getLoading } from 'decentraland-dapps/dist/modules/authorization/selectors'
import { RootState } from '../../modules/reducer'
import { getContract } from '../../modules/contract/selectors'
import { Contract } from '../../modules/vendor/services'
import {
  MapStateProps,
  MapDispatchProps,
  MapDispatch
} from './AuthorizationModal.types'
import AuthorizationModal from './AuthorizationModal'

const mapState = (state: RootState): MapStateProps => ({
  authorizations: getAuthorizations(state),
  isAuthorizing:
    isLoadingType(getLoading(state), GRANT_TOKEN_REQUEST) ||
    isLoadingType(getLoading(state), REVOKE_TOKEN_REQUEST),
  getContract: (query: Partial<Contract>) => getContract(state, query)
})

const mapDispatch = (_dispatch: MapDispatch): MapDispatchProps => ({})

export default connect(mapState, mapDispatch)(AuthorizationModal)
