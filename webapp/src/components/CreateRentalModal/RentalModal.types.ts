import { Dispatch } from 'redux'
import { Authorization } from 'decentraland-dapps/dist/modules/authorization/types'
import { openModal } from 'decentraland-dapps/dist/modules/modal/actions'
import { NFT } from '../../modules/nft/types'
import { RentalListing } from '@dcl/schemas'

export type Props = {
  open: boolean
  nft: NFT
  rental: RentalListing | null
  address: string | undefined
  authorizations: Authorization[]
  onCancel: () => void
  onRemove: (nft: NFT) => ReturnType<typeof openModal>
}

export type MapStateProps = Pick<Props, 'address' | 'authorizations'>
export type MapDispatchProps = Pick<Props, 'onRemove'>
export type MapDispatch = Dispatch
export type OwnProps = Pick<Props, 'open' | 'nft' | 'onCancel'>
