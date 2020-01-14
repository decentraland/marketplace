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

export type Wearable = {
  description: string
  category: WearableCategory
  rarity: WearableRarity
}
