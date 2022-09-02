import { Dispatch } from 'redux'
import { Authorization } from 'decentraland-dapps/dist/modules/authorization/types'
import { NFT } from '../../modules/nft/types'

export type Props = {
  open: boolean
  nft: NFT
  address: string | undefined
  authorizations: Authorization[]
  onCancel: () => void
}

export type MapStateProps = Pick<Props, 'address' | 'authorizations'>
export type MapDispatchProps = {}
export type MapDispatch = Dispatch
export type OwnProps = Pick<Props, 'open' | 'nft' | 'onCancel'>
