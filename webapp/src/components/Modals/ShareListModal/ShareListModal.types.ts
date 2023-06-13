import { ModalProps } from 'decentraland-dapps/dist/providers/ModalProvider/ModalProvider.types'
import { List } from '../../../modules/favorites/types'

export type ShareListMetadata = {
  list: List
}

export type Props = Omit<ModalProps, 'metadata'> & {
  metadata: ShareListMetadata
}

export type MapDispatchProps = Pick<Props, 'onClose'>
export type OwnProps = Pick<Props, 'metadata'>
