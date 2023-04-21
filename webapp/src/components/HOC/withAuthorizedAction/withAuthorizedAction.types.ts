import { Dispatch } from 'redux'
import {
  fetchAuthorizationsRequest,
  FetchAuthorizationsRequestAction
} from 'decentraland-dapps/dist/modules/authorization/actions'
import { Authorization } from 'decentraland-dapps/dist/modules/authorization/types'

export type WithAuthorizedActionProps = {
  onAuthorizedAction: (
    requiredAllowanceInWei: string,
    onAuthorized: () => void
  ) => void
  onSetAuthorization: (authorization: Authorization) => void 
}

export type MapDispatchProps = {
  onFetchAuthorizations: typeof fetchAuthorizationsRequest
}
export type MapStateProps = { authorizations: Authorization[] }
export type MapDispatch = Dispatch<FetchAuthorizationsRequestAction>
