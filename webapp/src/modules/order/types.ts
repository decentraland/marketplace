export enum OrderCategory {
  PARCEL = 'parcel',
  ESTATE = 'estate',
  WEARABLE = 'wearable'
}

export type OrderStatus = 'open' | 'sold' | 'cancelled'

export type WearableCategory =
  | 'body_shape'
  | 'earring'
  | 'eyebrows'
  | 'eyes'
  | 'eyewear'
  | 'facial_hair'
  | 'feet'
  | 'hair'
  | 'lower_body'
  | 'mouth'
  | 'tiara'
  | 'upper_body'

export type WearableRarity =
  | 'unique'
  | 'mythic'
  | 'legendary'
  | 'epic'
  | 'swanky'

export type Order = {
  id: string
  nft: {
    name: string
    description: string
    image: string
    parcel: {
      x: number
      y: number
    }
    estate: {
      size: number
    }
    wearable: {
      description: string
      category: WearableCategory
      rarity: WearableRarity
    }
  }
  category: OrderCategory
  nftAddress: string
  owner: string
  buyer: string | null
  price: string
  status: OrderStatus
  expiresAt: string
  createdAt: string
  updatedAt: string
}
