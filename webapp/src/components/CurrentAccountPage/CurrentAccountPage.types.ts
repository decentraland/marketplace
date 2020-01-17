import { Dispatch } from 'redux'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { CallHistoryMethodAction } from 'connected-react-router'
import { SearchSection } from '../../modules/routing/search'

export type Props = {
  section: SearchSection
  wallet: Wallet | null
  isConnecting: boolean
  onNavigate: (path: string) => void
}

export type MapStateProps = Pick<Props, 'section' | 'wallet' | 'isConnecting'>
export type MapDispatchProps = Pick<Props, 'onNavigate'>
export type MapDispatch = Dispatch<CallHistoryMethodAction>
