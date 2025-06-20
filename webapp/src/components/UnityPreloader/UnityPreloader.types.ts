import { Dispatch } from 'redux'
import { setUnityPreloaderStatus, SetUnityPreloaderStatusAction } from '../../modules/ui/preview/actions'

export type Props = {
  isLoading: boolean
  isReady: boolean
  onSetUnityPreloaderStatus: typeof setUnityPreloaderStatus
}

export type MapStateProps = Pick<Props, 'isLoading' | 'isReady'>
export type MapDispatchProps = Pick<Props, 'onSetUnityPreloaderStatus'>
export type MapDispatch = Dispatch<SetUnityPreloaderStatusAction>
