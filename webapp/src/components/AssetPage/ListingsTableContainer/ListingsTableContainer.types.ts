import { Item, OrderSortBy } from '@dcl/schemas'
import { OrderDirection } from '../OwnersTable/OwnersTable.types'

export enum BelowTabs {
  LISTINGS = 'listings',
  OWNERS = 'owners'
}

export type Props = {
  item: Item
}

export type SortByType = OrderSortBy | OrderDirection
