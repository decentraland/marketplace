import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'

export type Props = {
  wallet: Wallet | null
  isConnecting: boolean
  onBack: (location?: string) => void
}

export type MapStateProps = Pick<Props, 'wallet' | 'isConnecting'>
export type MapDispatchProps = Pick<Props, 'onBack'>
