import { Dispatch } from 'redux'
import { Item } from '@dcl/schemas'
import { openModal, OpenModalAction } from 'decentraland-dapps/dist/modules/modal/actions'
import { bulkPickUnpickStart, BulkPickUnpickStartAction } from '../../modules/favorites/actions'

export type Props = {
  className?: string
  item: Item
  isCollapsed?: boolean
  isPickedByUser: boolean
  count: number
  isLoading: boolean
  onCounterClick: (item: Item) => ReturnType<typeof openModal>
  onClick: () => ReturnType<typeof bulkPickUnpickStart>
}

export type MapStateProps = Pick<Props, 'isPickedByUser' | 'count' | 'isLoading'>

export type MapDispatchProps = Pick<Props, 'onCounterClick' | 'onClick'>
export type MapDispatch = Dispatch<BulkPickUnpickStartAction | OpenModalAction>

export type OwnProps = Pick<Props, 'item'>
