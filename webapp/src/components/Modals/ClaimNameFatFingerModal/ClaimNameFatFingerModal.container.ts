import { connect } from 'react-redux'
import { ChainId } from '@dcl/schemas'
import { openFiatGatewayWidgetRequest } from 'decentraland-dapps/dist/modules/gateway/actions'
import { openModal } from 'decentraland-dapps/dist/modules/modal'
import {
  FiatGateway,
  FiatGatewayOptions,
  FiatGatewayListeners
} from 'decentraland-dapps/dist/modules/gateway/types'
import { RootState } from '../../../modules/reducer'
import { isWaitingTxClaimName } from '../../../modules/ens/selectors'
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

export default connect(mapState, mapDispatch)(ClaimNameFatFingerModal)
