import { CancelledTrade } from '../../modules/vendor/decentraland/cancelledTrades/types'

export type Props = {
  address: string
  trades: CancelledTrade[]
  total: number
}

export type ModalProps = {
  open: boolean
  trades: CancelledTrade[]
  total: number
  onClose: () => void
}
