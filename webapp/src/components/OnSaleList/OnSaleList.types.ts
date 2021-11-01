import { Network, NFTCategory, Rarity } from '@dcl/schemas'

type Base = {
  title: string
  subtitle?: string
  saleType: 'primary' | 'secondary'
  network: Network
  price: string
}

type Wearable = Base & {
  type: NFTCategory.WEARABLE
  rarity: Rarity
  src: string
}

type Other = Base & {
  type: NFTCategory.PARCEL | NFTCategory.ESTATE | NFTCategory.ENS
}

export type Item = Wearable | Other

export type Props = {
  items: Item[]
}
