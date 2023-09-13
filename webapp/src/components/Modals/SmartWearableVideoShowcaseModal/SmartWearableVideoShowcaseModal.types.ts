import { ModalProps } from 'decentraland-dapps/dist/providers/ModalProvider/ModalProvider.types'

export type SmartWearableVideoShowcaseMetadata = {
  videoHash: string
}

export type Props = Omit<ModalProps, 'metadata'> & {
  metadata: SmartWearableVideoShowcaseMetadata
}

export type MapDispatchProps = Pick<Props, 'onClose'>
export type OwnProps = Pick<Props, 'metadata'>
