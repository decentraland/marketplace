import { ModalProps } from 'decentraland-dapps/dist/providers/ModalProvider/ModalProvider.types'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { Asset } from '../../../modules/asset/types'

export type Props = Omit<ModalProps, 'metadata'> & {
  metadata: { asset: Asset }
  wallet: Wallet | null
  onConfirm: () => void
}

export type OwnProps = Pick<Props, 'metadata'>
export type MapStateProps = Pick<Props, 'wallet'>
export type MapDispatchProps = Pick<Props, 'onConfirm'>
