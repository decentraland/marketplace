import { Dispatch } from 'redux'
import { OpenFiatGatewayWidgetRequestAction, openFiatGatewayWidgetRequest } from 'decentraland-dapps/dist/modules/gateway/actions'
import { OpenModalAction, openModal } from 'decentraland-dapps/dist/modules/modal'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { ModalProps } from 'decentraland-dapps/dist/providers/ModalProvider/ModalProvider.types'
import { ClaimNameRequestAction, ClaimNameTransactionSubmittedAction, claimNameTransactionSubmitted } from '../../../modules/ens/actions'

export type Props = Omit<ModalProps, 'metadata'> & {
  wallet: Wallet | null
  isClaimingName: boolean
  metadata: {
    name: string
    autoComplete?: boolean
  }
  onBuyWithCrypto: typeof openModal
  onClaimTxSubmitted: typeof claimNameTransactionSubmitted
  onOpenFiatGateway: typeof openFiatGatewayWidgetRequest
}

export type MapState = Pick<Props, 'isClaimingName' | 'wallet'>
export type MapDispatchProps = Pick<Props, 'onClaimTxSubmitted' | 'onOpenFiatGateway' | 'onBuyWithCrypto'>
export type MapDispatch = Dispatch<
  ClaimNameRequestAction | ClaimNameTransactionSubmittedAction | OpenFiatGatewayWidgetRequestAction | OpenModalAction
>
