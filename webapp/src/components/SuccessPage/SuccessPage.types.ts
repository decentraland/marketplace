import { CallHistoryMethodAction } from "connected-react-router"
import { Dispatch } from "redux"

export type Props = {
  isLoading: boolean
  onNavigate: (path: string) => void
}

export type MapStateProps = Pick<Props, 'isLoading'>
export type MapDispatchProps = Pick<Props, 'onNavigate'>

export type MapDispatch = Dispatch<CallHistoryMethodAction>
