import { Dispatch } from 'redux'
import { CallHistoryMethodAction } from 'connected-react-router'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { AuthIdentity } from 'decentraland-crypto-fetch'
import {
  OpenModalAction,
  openModal
} from 'decentraland-dapps/dist/modules/modal/actions'
import { BrowseOptions } from '../../../modules/routing/types'
import {
  ClaimNameTransactionSubmittedAction,
  claimNameTransactionSubmitted
} from '../../../modules/ens/actions'

export type Props = {
  currentMana: number | undefined
  wallet: Wallet | null
  isConnecting: boolean
  identity: AuthIdentity | undefined
  onClaimTxSubmitted: typeof claimNameTransactionSubmitted
  onBrowse: (options?: BrowseOptions) => void
  onClaim: typeof openModal
  onRedirect: (path: string) => void
}

export type MapStateProps = Pick<
  Props,
  'currentMana' | 'wallet' | 'isConnecting' | 'identity'
>
export type MapDispatchProps = Pick<
  Props,
  'onBrowse' | 'onClaim' | 'onRedirect' | 'onClaimTxSubmitted'
>
export type MapDispatch = Dispatch<
  | CallHistoryMethodAction
  | OpenModalAction
  | ClaimNameTransactionSubmittedAction
>
