import { Dispatch } from 'redux'
import { ModalProps } from 'decentraland-dapps/dist/providers/ModalProvider/ModalProvider.types'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { WithAuthorizedActionProps } from 'decentraland-dapps/dist/containers/withAuthorizedAction'
import {
  OpenFiatGatewayWidgetRequestAction,
  openFiatGatewayWidgetRequest
} from 'decentraland-dapps/dist/modules/gateway/actions'
import {
  ClaimNameClearAction,
  ClaimNameRequestAction,
  ClaimNameTransactionSubmittedAction,
  claimNameClear,
  claimNameRequest,
  claimNameTransactionSubmitted
} from '../../../modules/ens/actions'
import { Contract } from '../../../modules/vendor/services'
import { getContract } from '../../../modules/contract/selectors'

export type Props = ModalProps & {
  currentMana: number | undefined
  wallet: Wallet | null
  isLoading: boolean
  address?: string
  metadata: {
    name: string
  }
  isClaimingNamesWithFiatEnabled: boolean
  onClaim: typeof claimNameRequest
  onClaimNameClear: typeof claimNameClear
  getContract: (query: Partial<Contract>) => ReturnType<typeof getContract>
  onClaimTxSubmitted: typeof claimNameTransactionSubmitted
  onOpenFiatGateway: typeof openFiatGatewayWidgetRequest
} & WithAuthorizedActionProps

export type MapState = Pick<
  Props,
  | 'address'
  | 'getContract'
  | 'isLoading'
  | 'wallet'
  | 'currentMana'
  | 'isClaimingNamesWithFiatEnabled'
>
export type MapDispatchProps = Pick<
  Props,
  'onClaim' | 'onClaimNameClear' | 'onClaimTxSubmitted' | 'onOpenFiatGateway'
>
export type MapDispatch = Dispatch<
  | ClaimNameRequestAction
  | ClaimNameClearAction
  | ClaimNameTransactionSubmittedAction
  | OpenFiatGatewayWidgetRequestAction
>
