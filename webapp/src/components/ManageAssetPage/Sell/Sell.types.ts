import { Order } from '@dcl/schemas'
import { NFT } from '../../../modules/nft/types'

export type Props = {
  className?: string
  nft: NFT
  order?: Order | null
  isBeingRented: boolean
  onEditOrder: () => void
}

export type MapStateProps = {}
export type MapDispatchProps = Pick<Props, 'onEditOrder'>

export type OwnProps = Pick<
  Props,
  'nft' | 'order' | 'className' | 'isBeingRented'
>
