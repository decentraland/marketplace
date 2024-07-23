import { Dispatch } from 'redux'
import { Bid } from '@dcl/schemas'
import { WithAuthorizedActionProps } from 'decentraland-dapps/dist/containers/withAuthorizedAction'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import {
  CancelBidRequestAction,
  ArchiveBidAction,
  UnarchiveBidAction,
  AcceptBidRequestAction,
  cancelBidRequest,
  archiveBid,
  acceptBidRequest,
  unarchiveBid
} from '../../modules/bid/actions'

export type Props = {
  bid: Bid
  wallet: Wallet | null
  archivedBidIds: string[]
  isArchivable?: boolean
  hasImage?: boolean
  isBidsOffchainEnabled: boolean
  onCancel: typeof cancelBidRequest
  onArchive: typeof archiveBid
  onUnarchive: typeof unarchiveBid
  onAccept: typeof acceptBidRequest
  isAcceptingBid: boolean
} & WithAuthorizedActionProps

export type MapStateProps = Pick<Props, 'archivedBidIds' | 'wallet' | 'isAcceptingBid' | 'isBidsOffchainEnabled'>
export type MapDispatchProps = Pick<Props, 'onCancel' | 'onArchive' | 'onUnarchive' | 'onAccept'>
export type MapDispatch = Dispatch<CancelBidRequestAction | ArchiveBidAction | UnarchiveBidAction | AcceptBidRequestAction>

export type OwnProps = Pick<Props, 'bid' | 'isArchivable' | 'hasImage'>
