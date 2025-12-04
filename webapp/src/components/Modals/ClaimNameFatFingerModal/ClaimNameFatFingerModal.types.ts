import { Dispatch } from 'redux'
import { CreditsResponse } from 'decentraland-dapps/dist/modules/credits/types'
import { OpenFiatGatewayWidgetRequestAction, openFiatGatewayWidgetRequest } from 'decentraland-dapps/dist/modules/gateway/actions'
import { OpenModalAction } from 'decentraland-dapps/dist/modules/modal/actions'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { ModalProps } from 'decentraland-dapps/dist/providers/ModalProvider/ModalProvider.types'
import { ClaimNameRequestAction, ClaimNameTransactionSubmittedAction, claimNameTransactionSubmitted } from '../../../modules/ens/actions'

export type Props = Omit<ModalProps, 'metadata'> & {
  wallet: Wallet | null
  isClaimingName: boolean
  credits: CreditsResponse | undefined
  metadata: {
    name: string
    autoComplete?: boolean
  }
  onBuyWithCrypto: (name: string, useCredits?: boolean) => void
  onClaimTxSubmitted: typeof claimNameTransactionSubmitted
  onOpenFiatGateway: typeof openFiatGatewayWidgetRequest
}

export type MapState = Pick<Props, 'isClaimingName' | 'wallet' | 'credits'>
export type MapDispatchProps = Pick<Props, 'onClaimTxSubmitted' | 'onOpenFiatGateway' | 'onBuyWithCrypto'>
export type MapDispatch = Dispatch<
  ClaimNameRequestAction | ClaimNameTransactionSubmittedAction | OpenFiatGatewayWidgetRequestAction | OpenModalAction
>
