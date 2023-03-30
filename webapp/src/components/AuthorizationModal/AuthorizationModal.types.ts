import { Dispatch } from 'redux'
import { Authorization } from 'decentraland-dapps/dist/modules/authorization/types'
import { Contract } from '../../modules/vendor/services'
import { getContract } from '../../modules/contract/selectors'
import {
  fetchAuthorizationsRequest,
  FetchAuthorizationsRequestAction
} from 'decentraland-dapps/dist/modules/authorization/actions'
import {
  upsertContracts,
  UpsertContractsAction
} from '../../modules/contract/actions'

export type Props = {
  open: boolean
  authorization: Authorization
  authorizations: Authorization[]
  shouldUpdateSpendingCap?: boolean
  isAuthorizing: boolean
  isLoading?: boolean
  getContract: (query: Partial<Contract>) => ReturnType<typeof getContract>
  onCancel: () => void
  onProceed: () => void
  onFetchAuthorizations: typeof fetchAuthorizationsRequest
  onUpsertContracts: typeof upsertContracts
}

export type MapStateProps = Pick<
  Props,
  'authorizations' | 'isAuthorizing' | 'getContract'
>
export type MapDispatchProps = Pick<
  Props,
  'onFetchAuthorizations' | 'onUpsertContracts'
>
export type MapDispatch = Dispatch<
  FetchAuthorizationsRequestAction | UpsertContractsAction
>
export type OwnProps = Pick<
  Props,
  'open' | 'authorization' | 'onProceed' | 'isLoading'
>
