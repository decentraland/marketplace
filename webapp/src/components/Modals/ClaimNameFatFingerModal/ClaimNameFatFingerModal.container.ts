import { connect } from 'react-redux'
import { withAuthorizedAction } from 'decentraland-dapps/dist/containers'
import { AuthorizedAction } from 'decentraland-dapps/dist/containers/withAuthorizedAction/AuthorizationModal'
import { getAddress } from 'decentraland-dapps/dist/modules/wallet/selectors'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { RootState } from '../../../modules/reducer'
import {
  getClaimNameStatus,
  getLoading,
  isWaitingTxClaimName,
  getErrorMessage
} from '../../../modules/ens/selectors'
import {
  claimNameRequest,
  CLAIM_NAME_REQUEST,
  claimNameClear
} from '../../../modules/ens/actions'
import { Contract } from '../../../modules/vendor/services'
import { getContract } from '../../../modules/contract/selectors'
import {
  MapDispatch,
  MapDispatchProps,
  MapState
} from './ClaimNameFatFingerModal.types'
import ClaimNameFatFingerModal from './ClaimNameFatFingerModal'

const mapState = (state: RootState): MapState => ({
  isLoading:
    isLoadingType(getLoading(state), CLAIM_NAME_REQUEST) ||
    isWaitingTxClaimName(state),
  address: getAddress(state),
  getContract: (query: Partial<Contract>) => getContract(state, query)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onClaim: name => dispatch(claimNameRequest(name)),
  onClaimNameClear: () => dispatch(claimNameClear())
})

export default connect(
  mapState,
  mapDispatch
)(
  withAuthorizedAction(
    ClaimNameFatFingerModal,
    AuthorizedAction.CLAIM_NAME,
    {
      title_action: 'names_page.claim_name_fat_finger_modal.authorization.title_action',
      action: 'names_page.claim_name_fat_finger_modal.authorization.action'
    },
    getClaimNameStatus,
    getErrorMessage
  )
)
