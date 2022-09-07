import { ModalProps } from 'decentraland-dapps/dist/providers/ModalProvider/ModalProvider.types'

export type Metadata = {
  title: string
  subtitle: string
}

export type Props = Omit<ModalProps, 'metadata'> & {
  address: string
  metadata: Metadata
  onConfirm: () => void
}

export type MapStateProps = Pick<Props, 'address'>
export type MapDispatchProps = Pick<Props, 'onConfirm'>
