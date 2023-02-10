import { CallHistoryMethodAction } from 'connected-react-router'
import { Dispatch } from 'redux'
import { UserMenuProps } from 'decentraland-ui'

export type Props = Partial<UserMenuProps>

export type MapStateProps = Pick<Props, 'isSignedIn' | 'isSigningIn' | 'isActivity' | 'hasActivity'>
export type MapDispatchProps = Pick<Props, 'onClickActivity' | 'onClickSettings'>
export type MapDispatch = Dispatch<CallHistoryMethodAction>
