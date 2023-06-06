import { ModalProps } from 'decentraland-dapps/dist/providers/ModalProvider/ModalProvider.types'
import { List } from '../../../modules/favorites/types'

export type Props = Omit<ModalProps, 'metadata'> & {
  metadata: { list: List }
  isLoading: boolean
  onConfirm: () => void
}

export type OwnProps = Pick<Props, 'metadata'>
export type MapStateProps = Pick<Props, 'isLoading'>
export type MapDispatchProps = Pick<Props, 'onConfirm'>
