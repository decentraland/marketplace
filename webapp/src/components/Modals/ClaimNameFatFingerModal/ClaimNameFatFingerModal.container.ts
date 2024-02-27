import { connect } from 'react-redux'
import { ChainId, Network } from '@dcl/schemas'
import { withAuthorizedAction } from 'decentraland-dapps/dist/containers'
import { AuthorizedAction } from 'decentraland-dapps/dist/containers/withAuthorizedAction/AuthorizationModal'
import { getAddress } from 'decentraland-dapps/dist/modules/wallet/selectors'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { openFiatGatewayWidgetRequest } from 'decentraland-dapps/dist/modules/gateway/actions'
import { openModal } from 'decentraland-dapps/dist/modules/modal'
import {
  FiatGateway,
  FiatGatewayOptions,
  FiatGatewayListeners
} from 'decentraland-dapps/dist/modules/gateway/types'
import { RootState } from '../../../modules/reducer'
import {
  getClaimNameStatus,
  isWaitingTxClaimName,
  getErrorMessage
} from '../../../modules/ens/selectors'
import { claimNameTransactionSubmitted } from '../../../modules/ens/actions'
import { getWallet } from '../../../modules/wallet/selectors'
import {
  MapDispatch,
  MapDispatchProps,
  MapState
} from './ClaimNameFatFingerModal.types'
import ClaimNameFatFingerModal from './ClaimNameFatFingerModal'

const mapState = (state: RootState): MapState => ({
  isClaimingName: isWaitingTxClaimName(state),
  wallet: getWallet(state)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onBuyWithCrypto: (name: string) =>
    dispatch(openModal('MintNameWithCryptoModal', { name })),
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
