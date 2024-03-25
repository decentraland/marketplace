import { CallHistoryMethodAction } from 'connected-react-router'
import { Dispatch } from 'redux'
import { OpenModalAction, openModal } from 'decentraland-dapps/dist/modules/modal/actions'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { BrowseOptions } from '../../../modules/routing/types'

export type Props = {
  wallet: Wallet | null
  isConnecting: boolean
  onBrowse: (options?: BrowseOptions) => void
  onClaim: typeof openModal
  onRedirect: (path: string) => void
}

export type MapStateProps = Pick<Props, 'wallet' | 'isConnecting'>
export type MapDispatchProps = Pick<Props, 'onBrowse' | 'onClaim' | 'onRedirect'>
export type MapDispatch = Dispatch<CallHistoryMethodAction | OpenModalAction>
