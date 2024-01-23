import { ModalProps } from 'decentraland-dapps/dist/providers/ModalProvider/ModalProvider.types'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'

export type Metadata = {
  itemId: string
}

export type Props = Omit<ModalProps, 'metadata'> & {
  metadata: Metadata
  wallet: Wallet | null
}

export type MapStateProps = Pick<Props, 'wallet'>

export type OwnProps = Pick<Props, 'metadata'>
