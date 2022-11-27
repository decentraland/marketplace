import { Dispatch } from 'redux'
import { CallHistoryMethodAction } from 'connected-react-router'
import { UserMenuProps } from 'decentraland-ui/dist/components/UserMenu/UserMenu'

export type Props = Partial<UserMenuProps>

export type MapStateProps = Pick<
  Props,
  'isSignedIn' | 'isSigningIn' | 'isActivity' | 'hasActivity'
>
export type MapDispatchProps = Pick<
  Props,
  'onClickActivity' | 'onClickSettings'
>
export type MapDispatch = Dispatch<CallHistoryMethodAction>
