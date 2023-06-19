import { Dispatch } from 'redux'
import { CallHistoryMethodAction } from 'connected-react-router'
import { UserMenuProps } from 'decentraland-ui'

export type Props = Partial<UserMenuProps> & {
  onClickMyAssets: () => void
  onClickMyLists: () => void
  onClickMyListsV1: () => void
  isListV1Enabled: boolean
}

export type MapStateProps = Pick<
  Props,
  | 'isSignedIn'
  | 'isSigningIn'
  | 'isActivity'
  | 'hasActivity'
  | 'isListV1Enabled'
>
export type MapDispatchProps = Pick<
  Props,
  | 'onClickActivity'
  | 'onClickSettings'
  | 'onClickMyAssets'
  | 'onClickMyLists'
  | 'onClickMyListsV1'
>
export type MapDispatch = Dispatch<CallHistoryMethodAction>
