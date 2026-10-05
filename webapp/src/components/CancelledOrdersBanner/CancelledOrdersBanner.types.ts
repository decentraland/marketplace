import { CancelledTrade } from '../../modules/vendor/decentraland/cancelledTrades/types'

export type Props = {
  address: string
  trades: CancelledTrade[]
  total: number
  hasMore: boolean
  isLoadingMore: boolean
  error: string | null
  onLoadMore: () => void
}

export type ModalProps = Omit<Props, 'address'> & {
  open: boolean
  onClose: () => void
}
