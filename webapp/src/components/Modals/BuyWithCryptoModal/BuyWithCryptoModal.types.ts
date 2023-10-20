import { Order } from '@dcl/schemas'
import { ModalProps } from 'decentraland-dapps/dist/providers/ModalProvider/ModalProvider.types'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { Asset } from '../../../modules/asset/types'
import { switchNetworkRequest } from 'decentraland-dapps/dist/modules/wallet/actions'

export type Props = Omit<ModalProps, 'metadata'> & {
  metadata: { asset: Asset; order?: Order }
  wallet: Wallet | null
  order: Order | null
  onConfirm: () => void
  onSwitchNetwork: typeof switchNetworkRequest
}

export type OwnProps = Pick<Props, 'metadata'>
export type MapStateProps = Pick<Props, 'wallet' | 'order'>
export type MapDispatchProps = Pick<Props, 'onConfirm' | 'onSwitchNetwork'>
