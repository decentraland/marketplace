import { CallHistoryMethodAction } from 'connected-react-router'
import { Dispatch } from 'redux'
import { Authorization } from 'decentraland-dapps/dist/modules/authorization/types'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { fetchContractsRequest, FetchContractsRequestAction } from '../../modules/contract/actions'
import { getContract } from '../../modules/contract/selectors'
import { Contract } from '../../modules/vendor/services'

export type Props = {
  wallet: Wallet | null
  authorizations: Authorization[]
  isLoading: boolean
  hasError: boolean
  isConnecting: boolean
  hasFetchedContracts: boolean
  getContract: (query: Partial<Contract>) => ReturnType<typeof getContract>
  onNavigate: (path: string) => void
  onFetchContracts: typeof fetchContractsRequest
}

export type MapStateProps = Pick<
  Props,
  'wallet' | 'authorizations' | 'isLoading' | 'isConnecting' | 'hasError' | 'getContract' | 'hasFetchedContracts'
>
export type MapDispatchProps = Pick<Props, 'onNavigate' | 'onFetchContracts'>
export type MapDispatch = Dispatch<CallHistoryMethodAction | FetchContractsRequestAction>
