import {
  grantTokenRequest,
  GrantTokenRequestAction
} from 'decentraland-dapps/dist/modules/authorization/actions'
import { Authorization } from 'decentraland-dapps/dist/modules/authorization/types'
import { Dispatch } from 'redux'
import { NFT } from '../../modules/nft/types'
import {
  createRentalRequest,
  CreateRentalRequestAction
} from '../../modules/rental/actions'

export type Props = {
  open: boolean
  nft: NFT
  isCreating: boolean
  isGranting: boolean
  address: string | undefined
  authorizations: Authorization[]
  onCancel: () => void
  onCreate: typeof createRentalRequest
  onGrant: typeof grantTokenRequest
  error: string | null
}

export type MapStateProps = Pick<
  Props,
  'isCreating' | 'address' | 'authorizations' | 'isGranting' | 'error'
>
export type MapDispatchProps = Pick<Props, 'onCreate' | 'onGrant'>
export type MapDispatch = Dispatch<
  CreateRentalRequestAction | GrantTokenRequestAction
>
export type OwnProps = Pick<Props, 'open' | 'nft' | 'onCancel'>
