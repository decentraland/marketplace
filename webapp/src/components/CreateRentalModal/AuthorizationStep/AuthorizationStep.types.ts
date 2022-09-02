import {
  grantTokenRequest,
  GrantTokenRequestAction
} from 'decentraland-dapps/dist/modules/authorization/actions'
import { Dispatch } from 'redux'
import { NFT } from '../../../modules/nft/types'

export type Props = {
  open: boolean
  nft: NFT
  isAuthorizing: boolean
  isConfirmingAuthorization: boolean
  address: string
  onCancel: () => void
  onAuthorize: typeof grantTokenRequest
  error: string | null
}

export type MapStateProps = Pick<
  Props,
  'address' | 'isAuthorizing' | 'isConfirmingAuthorization' | 'error'
>
export type MapDispatchProps = Pick<Props, 'onAuthorize'>
export type MapDispatch = Dispatch<GrantTokenRequestAction>
export type OwnProps = Pick<Props, 'open' | 'nft' | 'onCancel'>
