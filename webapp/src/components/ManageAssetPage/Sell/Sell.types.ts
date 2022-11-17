import { Order } from '@dcl/schemas'
import { NFT } from '../../../modules/nft/types'

export type Props = {
  className?: string
  nft: NFT
  order?: Order | null
  isLandLocked: boolean
  onEditOrder: () => void
  onCancelOrder: () => void
}

export type MapStateProps = {}
export type MapDispatchProps = Pick<Props, 'onEditOrder' | 'onCancelOrder'>

export type OwnProps = Pick<
  Props,
  'nft' | 'order' | 'className' | 'isLandLocked'
>
