import { Item } from '@dcl/schemas'
import { SortByOptions } from '../ListingsTable/ListingsTable.types'
import { OrderDirection } from '../OwnersTable/OwnersTable.types'

export enum BelowTabs {
  LISTINGS = 'listings',
  OWNERS = 'owners'
}

export type Props = {
  item: Item
}

export type SortByType = SortByOptions | OrderDirection
