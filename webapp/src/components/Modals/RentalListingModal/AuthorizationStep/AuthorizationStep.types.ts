import { Dispatch } from 'redux'
import {
  fetchAuthorizationsRequest,
  FetchAuthorizationsRequestAction,
  grantTokenRequest,
  GrantTokenRequestAction
} from 'decentraland-dapps/dist/modules/authorization/actions'
import { NFT } from '../../../../modules/nft/types'

export type Props = {
  nft: NFT
  isAuthorizing: boolean
  isConfirmingAuthorization: boolean
  address: string
  error: string | null
  isFetchingAuthorizations: boolean
  onCancel: () => void
  onAuthorize: typeof grantTokenRequest
  onFetchAuthorizations: typeof fetchAuthorizationsRequest
}

export type MapStateProps = Pick<Props, 'address' | 'isAuthorizing' | 'isConfirmingAuthorization' | 'error' | 'isFetchingAuthorizations'>
export type MapDispatchProps = Pick<Props, 'onAuthorize' | 'onFetchAuthorizations'>
export type MapDispatch = Dispatch<GrantTokenRequestAction | FetchAuthorizationsRequestAction>
export type OwnProps = Pick<Props, 'nft' | 'onCancel'>
