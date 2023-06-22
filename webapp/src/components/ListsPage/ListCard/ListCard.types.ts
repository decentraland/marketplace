import { Dispatch } from 'redux'
import { Item } from '@dcl/schemas'
import { OpenModalAction } from 'decentraland-dapps/dist/modules/modal/actions'
import { List } from '../../../modules/favorites/types'

export type Props = {
  list: List
  items: Item[]
  onDeleteList: () => void
  onEditList: () => void
  enableActions?: boolean
}

export type OwnProps = Pick<Props, 'list' | 'enableActions'>
export type MapStateProps = Pick<Props, 'items'>
export type MapDispatchProps = Pick<Props, 'onDeleteList' | 'onEditList'>
export type MapDispatch = Dispatch<OpenModalAction>
