import { Item } from '@dcl/schemas'

export enum BelowTabs {
  LISTINGS = 'listings',
  OWNERS = 'owners'
}

export type Props = {
  item: Item
}
