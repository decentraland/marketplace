import { Dispatch } from 'redux'
import { NFT } from '../../../modules/nft/types'
import { createRentalRequest } from '../../../modules/rental/actions'

export type Props = {
  open: boolean
  nft: NFT
  onCancel: () => void
  onCreate: (...params: Parameters<typeof createRentalRequest>) => void
}

export type MapStateProps = {}
export type MapDispatchProps = {}
export type MapDispatch = Dispatch
export type OwnProps = Pick<Props, 'open' | 'nft' | 'onCreate' | 'onCancel'>
