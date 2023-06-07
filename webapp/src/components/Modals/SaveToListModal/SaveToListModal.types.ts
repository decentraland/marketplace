import { ModalProps } from 'decentraland-dapps/dist/providers/ModalProvider/ModalProvider.types'

type Metadata = {
  itemId: string
}

export type Props = Omit<ModalProps, 'metadata'> & {
  metadata: Metadata
  onPickItem: (itemId: string, listId: string) => void
  onUnpickItem: (itemId: string, listId: string) => void
  onCreateList: (itemId: string) => void
}
