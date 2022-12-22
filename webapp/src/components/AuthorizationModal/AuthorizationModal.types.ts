import { Dispatch } from 'redux'
import { Authorization } from 'decentraland-dapps/dist/modules/authorization/types'
import { Contract } from '../../modules/vendor/services'
import { getContract } from '../../modules/contract/selectors'
import {
  fetchAuthorizationsRequest,
  FetchAuthorizationsRequestAction
} from 'decentraland-dapps/dist/modules/authorization/actions'

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
}

export type MapStateProps = Pick<
  Props,
  'authorizations' | 'isAuthorizing' | 'getContract'
>
export type MapDispatchProps = Pick<Props, 'onFetchAuthorizations'>
export type MapDispatch = Dispatch<FetchAuthorizationsRequestAction>
export type OwnProps = Pick<
  Props,
  'open' | 'authorization' | 'onProceed' | 'isLoading'
>
