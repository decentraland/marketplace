import { Dispatch } from 'redux'
import { CallHistoryMethodAction } from 'connected-react-router'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { Authorization } from 'decentraland-dapps/dist/modules/authorization/types'
import { Contract } from '../../modules/vendor/services'
import { getContract } from '../../modules/contract/selectors'

export type Props = {
  wallet: Wallet | null
  authorizations: Authorization[]
  isLoadingAuthorization: boolean
  hasError: boolean
  isConnecting: boolean
  getContract: (query: Partial<Contract>) => ReturnType<typeof getContract>
  onNavigate: (path: string) => void
}

export type MapStateProps = Pick<
  Props,
  | 'wallet'
  | 'authorizations'
  | 'isLoadingAuthorization'
  | 'isConnecting'
  | 'hasError'
  | 'getContract'
>
export type MapDispatchProps = Pick<Props, 'onNavigate'>
export type MapDispatch = Dispatch<CallHistoryMethodAction>
