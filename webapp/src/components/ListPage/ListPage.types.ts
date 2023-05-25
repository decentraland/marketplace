import { Dispatch } from 'redux'
import { CallHistoryMethodAction } from 'connected-react-router'
import { RouteComponentProps } from 'react-router-dom'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'

type Params = { listId?: string }

export type Props = {
  wallet: Wallet | null
  isConnecting: boolean
  listId?: string
  onRedirect: (path: string) => void
} & RouteComponentProps<Params>

export type MapStateProps = Pick<Props, 'wallet' | 'isConnecting' | 'listId'>

export type MapDispatchProps = Pick<Props, 'onRedirect'>
export type MapDispatch = Dispatch<CallHistoryMethodAction>
export type OwnProps = RouteComponentProps<Params>
