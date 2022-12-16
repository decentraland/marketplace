import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { Authorization } from 'decentraland-dapps/dist/modules/authorization/types'
import { Contract } from '../../modules/vendor/services'
import { getContract } from '../../modules/contract/selectors'

export type Props = {
  wallet: Wallet | null
  authorizations: Authorization[]
  isLoading: boolean
  hasError: boolean
  isConnecting: boolean
  hasIncludedMaticCollections: boolean
  getContract: (query: Partial<Contract>) => ReturnType<typeof getContract>
  onNavigate: (path: string) => void
  onFetchContracts: () => void
}

export type MapStateProps = Pick<
  Props,
  | 'wallet'
  | 'authorizations'
  | 'isLoading'
  | 'isConnecting'
  | 'hasError'
  | 'getContract'
  | 'hasIncludedMaticCollections'
>
export type MapDispatchProps = Pick<Props, 'onNavigate' | 'onFetchContracts'>
