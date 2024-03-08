import { ModalProps } from 'decentraland-dapps/dist/providers/ModalProvider/ModalProvider.types'
import { updateListRequest } from '../../../modules/favorites/actions'
import { CreateListParameters, List } from '../../../modules/favorites/types'

export type Metadata = {
  list: List
} & OverrideCreateListTypes

export type Props = Omit<ModalProps, 'metadata'> & {
  isLoading: boolean
  metadata?: Metadata
  error: string | null
  onCreateList: (params: CreateListParameters) => void
  onEditList: typeof updateListRequest
}

export type OwnProps = Pick<Props, 'metadata' | 'onClose'>
export type MapDispatchProps = Pick<Props, 'onCreateList' | 'onEditList' | 'onClose'>
export type MapStateProps = Pick<Props, 'isLoading' | 'error'>

export type OverrideCreateListTypes = Partial<Pick<Props, 'isLoading' | 'error' | 'onCreateList'>>
