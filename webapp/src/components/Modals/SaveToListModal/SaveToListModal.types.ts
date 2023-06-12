import { Item } from '@dcl/schemas'
import { AuthIdentity } from 'decentraland-crypto-fetch'
import { ModalProps } from 'decentraland-dapps/dist/providers/ModalProvider/ModalProvider.types'

type Metadata = {
  item: Item
}

export type Props = Omit<ModalProps, 'metadata'> & {
  metadata: Metadata
  identity: AuthIdentity | undefined
  onPickItem: (listId: string) => void
  onUnpickItem: (listId: string) => void
  onCreateList: () => void
}

export type MapStateProps = Pick<Props, 'identity'>
export type OwnProps = Pick<Props, 'metadata' | 'onClose'>
export type MapDispatchProps = Pick<
  Props,
  'onPickItem' | 'onUnpickItem' | 'onCreateList'
>
