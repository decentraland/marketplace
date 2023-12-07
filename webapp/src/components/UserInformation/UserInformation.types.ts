import { Dispatch } from 'redux'
import { CallHistoryMethodAction } from 'connected-react-router'
import { UserInformationProps } from 'decentraland-dapps/dist/containers/UserInformation/UserInformation.types'
import { OpenLoginAction } from '../../modules/login/actions'

export type Props = Partial<UserInformationProps> & {
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
