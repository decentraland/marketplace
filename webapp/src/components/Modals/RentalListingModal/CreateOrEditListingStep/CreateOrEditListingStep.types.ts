import { Dispatch } from 'redux'
import { RentalListing } from '@dcl/schemas'
import { NFT } from '../../../../modules/nft/types'
import { upsertRentalRequest } from '../../../../modules/rental/actions'

export type Props = {
  nft: NFT
  rental: RentalListing | null
  onCancel: () => void
  onCreate: (...params: Parameters<typeof upsertRentalRequest>) => void
  onRemove: (nft: NFT) => unknown
}

export type MapStateProps = {}
export type MapDispatchProps = {}
export type MapDispatch = Dispatch
export type OwnProps = Pick<Props, 'nft' | 'onCreate' | 'onRemove' | 'onCancel'>
