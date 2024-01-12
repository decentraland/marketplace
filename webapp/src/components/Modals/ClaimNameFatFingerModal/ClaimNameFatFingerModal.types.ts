import { Dispatch } from 'redux'
import { AuthIdentity } from 'decentraland-crypto-fetch'
import { ModalProps } from 'decentraland-dapps/dist/providers/ModalProvider/ModalProvider.types'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { WithAuthorizedActionProps } from 'decentraland-dapps/dist/containers/withAuthorizedAction'
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
  wallet: Wallet | null
  identity: AuthIdentity | undefined
  isLoading: boolean
  address?: string
  metadata: {
    name: string
  }
  onClaim: typeof claimNameRequest
  onClaimNameClear: typeof claimNameClear
  getContract: (query: Partial<Contract>) => ReturnType<typeof getContract>
  onClaimTxSubmitted: typeof claimNameTransactionSubmitted
} & WithAuthorizedActionProps

export type MapState = Pick<
  Props,
  'address' | 'getContract' | 'isLoading' | 'wallet' | 'identity'
>
export type MapDispatchProps = Pick<
  Props,
  'onClaim' | 'onClaimNameClear' | 'onClaimTxSubmitted'
>
export type MapDispatch = Dispatch<
  | ClaimNameRequestAction
  | ClaimNameClearAction
  | ClaimNameTransactionSubmittedAction
>
