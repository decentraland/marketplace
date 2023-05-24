import { ModalProps } from 'decentraland-dapps/dist/providers/ModalProvider/ModalProvider.types'
import { createListRequest } from '../../../modules/favorites/actions'

export type Props = ModalProps & {
  isLoading: boolean
  error: string | null
  onCreateList: typeof createListRequest
}

export type MapDispatchProps = Pick<Props, 'onCreateList' | 'onClose'>
export type MapStateProps = Pick<Props, 'isLoading' | 'error'>
