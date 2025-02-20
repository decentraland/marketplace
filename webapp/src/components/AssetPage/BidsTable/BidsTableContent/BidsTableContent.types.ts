import { Bid, BidSortBy, Network } from '@dcl/schemas'
import { WithAuthorizedActionProps } from 'decentraland-dapps/dist/containers/withAuthorizedAction'
import { Asset } from '../../../../modules/asset/types'

export type Props = WithAuthorizedActionProps & {
  address?: string
  connectedNetwork?: Network
  asset: Asset
  isBidsOffchainEnabled: boolean
  onAccept: (bid: Bid) => void
  isAcceptingBid: boolean
  sortBy: BidSortBy
}

export type MapStateProps = Pick<Props, 'isBidsOffchainEnabled' | 'address' | 'isAcceptingBid' | 'connectedNetwork'>
export type MapDispatchProps = Pick<Props, 'onAccept'>
