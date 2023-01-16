import { ModalProps } from 'decentraland-dapps/dist/providers/ModalProvider/ModalProvider.types'

export type Metadata = {}

export type Props = Omit<ModalProps, 'metadata'> & {
  metadata: Metadata
  onContinue: () => void
}

export type OwnProps = Pick<Props, 'metadata'>
export type MapDispatchProps = Pick<Props, 'onContinue'>
