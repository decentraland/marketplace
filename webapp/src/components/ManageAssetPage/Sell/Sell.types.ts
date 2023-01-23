import { Order, RentalListing } from '@dcl/schemas'

import { NFT } from '../../../modules/nft/types'

export type Props = {
  className?: string
  nft: NFT
  order?: Order | null
  rental: RentalListing | null
  userAddress: string
  onEditOrder: () => void
  onCancelOrder: () => void
  onListForSale: () => void
}

export type MapStateProps = {}

export type MapDispatchProps = Pick<
  Props,
  'onEditOrder' | 'onCancelOrder' | 'onListForSale'
>

export type OwnProps = Pick<Props, 'nft' | 'order' | 'className' | 'rental'>
