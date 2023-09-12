import { Dispatch } from 'redux'
import { CallHistoryMethodAction } from 'connected-react-router'
import { UserInformationComponentProps } from 'decentraland-ui'
import { OpenLoginAction } from '../../modules/login/actions'

export type Props = Partial<UserInformationComponentProps> & {
  onClickMyAssets: () => void
  onClickMyLists: () => void
}

export type MapStateProps = Pick<
  Props,
  'isSignedIn' | 'isSigningIn' | 'hasActivity'
>
export type MapDispatchProps = Pick<
  Props,
  | 'onClickActivity'
  | 'onClickSettings'
  | 'onClickMyAssets'
  | 'onClickMyLists'
  | 'onSignIn'
>
export type MapDispatch = Dispatch<CallHistoryMethodAction | OpenLoginAction>
