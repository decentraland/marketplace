import { ModalProps } from 'decentraland-dapps/dist/providers/ModalProvider/ModalProvider.types'
import {
  createListRequest,
  updateListRequest
} from '../../../modules/favorites/actions'
import { List } from '../../../modules/favorites/types'

export type Metadata = {
  list: List
}

export type Props = Omit<ModalProps, 'metadata'> & {
  isLoading: boolean
  metadata?: Metadata
  error: string | null
  onCreateList: typeof createListRequest
  onEditList: typeof updateListRequest
}

export type OwnProps = Pick<Props, 'metadata' | 'onClose'>
export type MapDispatchProps = Pick<
  Props,
  'onCreateList' | 'onEditList' | 'onClose'
>
export type MapStateProps = Pick<Props, 'isLoading' | 'error'>
