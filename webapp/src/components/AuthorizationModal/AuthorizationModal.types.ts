import { Dispatch } from 'redux'
import { fetchAuthorizationsRequest, FetchAuthorizationsRequestAction } from 'decentraland-dapps/dist/modules/authorization/actions'
import { Authorization } from 'decentraland-dapps/dist/modules/authorization/types'
import { upsertContracts, UpsertContractsAction } from '../../modules/contract/actions'
import { getContract } from '../../modules/contract/selectors'
import { Contract } from '../../modules/vendor/services'

export type Props = {
  open: boolean
  authorization: Authorization
  authorizations: Authorization[]
  isAuthorizing: boolean
  isLoading?: boolean
  getContract: (query: Partial<Contract>) => ReturnType<typeof getContract>
  onCancel: () => void
  onProceed: () => void
  onFetchAuthorizations: typeof fetchAuthorizationsRequest
  onUpsertContracts: typeof upsertContracts
}

export type MapStateProps = Pick<Props, 'authorizations' | 'isAuthorizing' | 'getContract'>
export type MapDispatchProps = Pick<Props, 'onFetchAuthorizations' | 'onUpsertContracts'>
export type MapDispatch = Dispatch<FetchAuthorizationsRequestAction | UpsertContractsAction>
export type OwnProps = Pick<Props, 'open' | 'authorization' | 'onProceed' | 'isLoading'>
