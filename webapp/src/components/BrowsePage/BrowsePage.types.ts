import { Dispatch } from 'redux'
import { CallHistoryMethodAction } from 'connected-react-router'

export type Props = {
  vendor: string
  onNavigate: (path: string) => void
}

export type MapStateProps = Pick<Props, 'vendor'>
export type MapDispatchProps = Pick<Props, 'onNavigate'>
export type MapDispatch = Dispatch<CallHistoryMethodAction>
