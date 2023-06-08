import { RefObject } from 'react'
import { Item, OrderSortBy } from '@dcl/schemas'
import { OrderDirection } from '../OwnersTable/OwnersTable.types'

export type Props = {
  item: Item
  ref: RefObject<HTMLDivElement>
}

export type SortByType = OrderSortBy | OrderDirection
