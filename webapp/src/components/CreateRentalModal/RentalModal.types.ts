import { Dispatch } from 'redux'
import { Authorization } from 'decentraland-dapps/dist/modules/authorization/types'
import { NFT } from '../../modules/nft/types'
import { RentalListing } from '@dcl/schemas'

export type Props = {
  open: boolean
  nft: NFT
  rental: RentalListing | null
  address: string | undefined
  authorizations: Authorization[]
  onCancel: () => void
}

export type MapStateProps = Pick<Props, 'address' | 'authorizations'>
export type MapDispatchProps = {}
export type MapDispatch = Dispatch
export type OwnProps = Pick<Props, 'open' | 'nft' | 'onCancel'>
