import { Order, RentalListing } from '@dcl/schemas'

import { NFT } from '../../../modules/nft/types'

export type Props = {
  className?: string
  nft: NFT
  order?: Order | null
  rental: RentalListing | null
  userAddress: string
  onEditOrder: () => void
  onListForSale: () => void
}

export type MapDispatchProps = Pick<Props, 'onEditOrder' | 'onListForSale'>
export type OwnProps = Pick<Props, 'nft' | 'order' | 'className' | 'rental'>
