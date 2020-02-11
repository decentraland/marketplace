import { Dispatch } from 'redux'
import { CallHistoryMethodAction } from 'connected-react-router'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { Bid } from '../../modules/bid/types'
import {
  CancelBidRequestAction,
  ArchiveBidAction,
  UnarchiveBidAction,
  AcceptBidRequestAction
} from '../../modules/bid/actions'

export type Props = {
  bid: Bid
  wallet: Wallet | null
  archivedBidIds: string[]
  isArchivable?: boolean
  hasImage?: boolean
  onUpdate: (bid: Bid) => void
  onCancel: (bid: Bid) => void
  onArchive: (bid: Bid) => void
  onUnarchive: (bid: Bid) => void
  onAccept: (bid: Bid) => void
}

export type MapStateProps = Pick<Props, 'archivedBidIds' | 'wallet'>
export type MapDispatchProps = Pick<
  Props,
  'onUpdate' | 'onCancel' | 'onArchive' | 'onUnarchive' | 'onAccept'
>
export type MapDispatch = Dispatch<
  | CallHistoryMethodAction
  | CancelBidRequestAction
  | ArchiveBidAction
  | UnarchiveBidAction
  | AcceptBidRequestAction
>

export type OwnProps = Pick<Props, 'bid' | 'isArchivable' | 'hasImage'>
