import { Dispatch } from 'redux'
import { Order, RentalListing } from '@dcl/schemas'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { Authorization } from 'decentraland-dapps/dist/modules/authorization/types'
import { OpenModalAction } from 'decentraland-dapps/dist/modules/modal/actions'
import { NFT } from '../../../modules/nft/types'

export type Props = {
  nft: NFT
  wallet: Wallet | null
  authorizations: Authorization[]
  rental: RentalListing | null
  order: Order | null
  userHasAlreadyBidsOnNft: boolean
  isRentalsEnabled: boolean
  onRent: (selectedPeriodIndex: number) => void
}

export type OwnProps = Pick<Props, 'nft' | 'rental' | 'order'>
export type MapStateProps = Pick<
  Props,
  'wallet' | 'authorizations' | 'userHasAlreadyBidsOnNft'
>
export type MapDispatchProps = Pick<Props, 'onRent'>
export type MapDispatch = Dispatch<OpenModalAction>
