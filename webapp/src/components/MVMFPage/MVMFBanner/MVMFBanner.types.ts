import { Dispatch } from 'redux'
import { CallHistoryMethodAction } from 'connected-react-router'

export type Props = {
  type: 'small' | 'medium' | 'big'
  isMVMFEnabled: boolean
  onNavigate: (path: string) => void
}

export type MapStateProps = Pick<Props, 'isMVMFEnabled'>
export type MapDispatchProps = Pick<Props, 'onNavigate'>
export type MapDispatch = Dispatch<CallHistoryMethodAction>
