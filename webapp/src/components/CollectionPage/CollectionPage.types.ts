import { Collection, Item } from '@dcl/schemas'

export type Props = {
  onBack: () => void
  collection: Collection
  items: Item[]
}
