// import { Dispatch } from 'react'
import { Item } from '@dcl/schemas'

export type Props = {
  className?: string
  item: Item
  isCollapsed?: boolean
  isPickedByUser: boolean
  count: number
  // onClick: typeof 'action'
}

export type MapStateProps = Pick<Props, 'isPickedByUser' | 'count'>

export type MapDispatchProps = {}
export type MapDispatch = {}
