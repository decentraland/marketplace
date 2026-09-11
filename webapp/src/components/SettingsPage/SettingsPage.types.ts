import { Dispatch } from 'redux'
import { fetchAuthorizationsRequest, FetchAuthorizationsRequestAction } from 'decentraland-dapps/dist/modules/authorization/actions'
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
  onFetchContracts: typeof fetchContractsRequest
  onFetchAuthorizations: typeof fetchAuthorizationsRequest
}

export type MapStateProps = Pick<
  Props,
  'wallet' | 'authorizations' | 'isLoading' | 'isConnecting' | 'hasError' | 'getContract' | 'hasFetchedContracts'
>
export type MapDispatchProps = Pick<Props, 'onFetchContracts' | 'onFetchAuthorizations'>
export type MapDispatch = Dispatch<FetchContractsRequestAction | FetchAuthorizationsRequestAction>
