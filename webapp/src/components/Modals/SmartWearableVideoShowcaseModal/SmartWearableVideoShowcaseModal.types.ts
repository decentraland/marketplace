import { ModalProps } from 'decentraland-dapps/dist/providers/ModalProvider/ModalProvider.types'
import { Asset } from '../../../modules/asset/types'

export type SmartWearableVideoShowcaseMetadata = {
  asset: Asset
}

export type Props = Omit<ModalProps, 'metadata'> & {
  metadata: SmartWearableVideoShowcaseMetadata
}

export type MapDispatchProps = Pick<Props, 'onClose'>
export type OwnProps = Pick<Props, 'metadata'>
