import { Dispatch } from 'redux'
import { OpenModalAction, openModal } from 'decentraland-dapps/dist/modules/modal/actions'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'

export type Props = {
  wallet: Wallet | null
  isConnecting: boolean
  onClaim: typeof openModal
}

export type MapStateProps = Pick<Props, 'wallet' | 'isConnecting'>
export type MapDispatchProps = Pick<Props, 'onClaim'>
export type MapDispatch = Dispatch<OpenModalAction>
