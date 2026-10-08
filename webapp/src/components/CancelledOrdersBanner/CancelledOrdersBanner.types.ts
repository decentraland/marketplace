import { Dispatch } from 'redux'
import { FetchCancelledTradesRequestAction } from '../../modules/cancelledTrades/actions'
import { CancelledTrade } from '../../modules/vendor/decentraland/cancelledTrades/types'

export type Props = {
  address?: string
  trades: CancelledTrade[]
  total: number
  hasMore: boolean
  isLoadingMore: boolean
  error: string | null
  onLoadMore: (skip: number) => void
}

export type MapStateProps = Pick<Props, 'address' | 'trades' | 'total' | 'hasMore' | 'isLoadingMore' | 'error'>
export type MapDispatchProps = Pick<Props, 'onLoadMore'>
export type MapDispatch = Dispatch<FetchCancelledTradesRequestAction>

export type ModalProps = Omit<Props, 'address'> & {
  open: boolean
  onClose: () => void
}
