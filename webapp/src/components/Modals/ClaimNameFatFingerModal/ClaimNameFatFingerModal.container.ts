import { connect } from 'react-redux'
import { ChainId, Network } from '@dcl/schemas'
import { withAuthorizedAction } from 'decentraland-dapps/dist/containers'
import { AuthorizedAction } from 'decentraland-dapps/dist/containers/withAuthorizedAction/AuthorizationModal'
import { getAddress } from 'decentraland-dapps/dist/modules/wallet/selectors'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { openFiatGatewayWidgetRequest } from 'decentraland-dapps/dist/modules/gateway/actions'
import {
  FiatGateway,
  FiatGatewayOptions,
  FiatGatewayListeners
} from 'decentraland-dapps/dist/modules/gateway/types'
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
  claimNameClear,
  claimNameTransactionSubmitted
} from '../../../modules/ens/actions'
import { Contract } from '../../../modules/vendor/services'
import { getContract } from '../../../modules/contract/selectors'
import { getMana, getWallet } from '../../../modules/wallet/selectors'
import { getIsClaimingNamesWithFiatEnabled } from '../../../modules/features/selectors'
import {
  MapDispatch,
  MapDispatchProps,
  MapState
} from './ClaimNameFatFingerModal.types'
import ClaimNameFatFingerModal from './ClaimNameFatFingerModal'

const mapState = (state: RootState): MapState => ({
  currentMana: getMana(state, Network.ETHEREUM),
  isLoading:
    isLoadingType(getLoading(state), CLAIM_NAME_REQUEST) ||
    isWaitingTxClaimName(state),
  address: getAddress(state),
  getContract: (query: Partial<Contract>) => getContract(state, query),
  wallet: getWallet(state),
  isClaimingNamesWithFiatEnabled: getIsClaimingNamesWithFiatEnabled(state)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onClaim: name => dispatch(claimNameRequest(name)),
  onClaimNameClear: () => dispatch(claimNameClear()),
  onOpenFiatGateway: (
    gateway: FiatGateway,
    options: FiatGatewayOptions,
    listeners?: FiatGatewayListeners
  ) => dispatch(openFiatGatewayWidgetRequest(gateway, options, listeners)),
  onClaimTxSubmitted: (
    subdomain: string,
    address: string,
    chainId: ChainId,
    txHash: string
  ) =>
    dispatch(claimNameTransactionSubmitted(subdomain, address, chainId, txHash))
})

export default connect(
  mapState,
  mapDispatch
)(
  withAuthorizedAction(
    ClaimNameFatFingerModal,
    AuthorizedAction.CLAIM_NAME,
    {
      title_action:
        'names_page.claim_name_fat_finger_modal.authorization.title_action',
      action: 'names_page.claim_name_fat_finger_modal.authorization.action'
    },
    getClaimNameStatus,
    getErrorMessage
  )
)
