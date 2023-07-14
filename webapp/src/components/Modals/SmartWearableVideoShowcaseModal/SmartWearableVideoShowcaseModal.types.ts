import { Item } from '@dcl/schemas'
import { ModalProps } from 'decentraland-dapps/dist/providers/ModalProvider/ModalProvider.types'

export type SmartWearableVideoShowcaseMetadata = {
  item: Item
}

export type Props = Omit<ModalProps, 'metadata'> & {
  metadata: SmartWearableVideoShowcaseMetadata
}

export type MapDispatchProps = Pick<Props, 'onClose'>
export type OwnProps = Pick<Props, 'metadata'>
