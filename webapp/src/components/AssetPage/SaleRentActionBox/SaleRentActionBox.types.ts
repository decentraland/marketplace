import { Order, RentalListing } from '@dcl/schemas'
import { Dispatch } from 'redux'
import {
  openModal,
  OpenModalAction
} from 'decentraland-dapps/dist/modules/modal/actions'
import { NFT } from '../../../modules/nft/types'

export type Props = {
  nft: NFT
  rental: RentalListing | null
  order: Order | null
  userHasAlreadyBidsOnNft: boolean
  isRentalsEnabled: boolean
  isOwner: boolean
  onBid: typeof openModal
  onSell: typeof openModal
  onRent: typeof openModal
}

export type OwnProps = Pick<Props, 'nft' | 'rental' | 'order'>
export type MapStateProps = Pick<Props, 'userHasAlreadyBidsOnNft' | 'isOwner'>
export type MapDispatchProps = Pick<Props, 'onBid' | 'onSell' | 'onRent'>
export type MapDispatch = Dispatch<OpenModalAction>
