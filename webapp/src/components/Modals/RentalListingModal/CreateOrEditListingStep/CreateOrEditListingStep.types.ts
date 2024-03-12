import { RentalListing } from '@dcl/schemas'
import { Dispatch } from 'redux'
import { upsertRentalRequest } from '../../../../modules/rental/actions'
import { NFT } from '../../../../modules/nft/types'

export type Props = {
  nft: NFT
  rental: RentalListing | null
  onCancel: () => void
  onCreate: (...params: Parameters<typeof upsertRentalRequest>) => void
  onRemove: (nft: NFT) => unknown
  isListForRentAgain: boolean | null
}

export type MapDispatch = Dispatch
export type OwnProps = Pick<Props, 'nft' | 'onCreate' | 'onRemove' | 'onCancel'>
