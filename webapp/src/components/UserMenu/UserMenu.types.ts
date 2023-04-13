import { Dispatch } from 'redux'
import { CallHistoryMethodAction } from 'connected-react-router'
import { UserMenuProps } from 'decentraland-ui'

export type Props = Partial<UserMenuProps> & {
  isFavoritesEnabled: boolean
  onClickMyAssets: () => void
  onClickMyLists: () => void
}

export type MapStateProps = Pick<
  Props,
  | 'isSignedIn'
  | 'isSigningIn'
  | 'isActivity'
  | 'hasActivity'
  | 'isFavoritesEnabled'
>
export type MapDispatchProps = Pick<
  Props,
  'onClickActivity' | 'onClickSettings' | 'onClickMyAssets' | 'onClickMyLists'
>
export type MapDispatch = Dispatch<CallHistoryMethodAction>
