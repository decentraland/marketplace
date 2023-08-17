import { CallHistoryMethodAction } from 'connected-react-router'
import { Dispatch } from 'redux'
import { UserMenuProps } from 'decentraland-ui'

export type Props = Partial<UserMenuProps> & {
  isProfileEnabled: boolean
  onClickMyAssets: () => void
  onClickMyLists: () => void
}

export type MapStateProps = Pick<Props, 'isSignedIn' | 'isSigningIn' | 'isActivity' | 'isProfileEnabled' | 'hasActivity'>
export type MapDispatchProps = Pick<Props, 'onClickActivity' | 'onClickSettings' | 'onClickMyAssets' | 'onClickMyLists'>
export type MapDispatch = Dispatch<CallHistoryMethodAction>
