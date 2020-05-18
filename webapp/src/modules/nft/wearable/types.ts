export enum WearableCategory {
  EYEBROWS = 'eyebrows',
  EYES = 'eyes',
  FACIAL_HAIR = 'facial_hair',
  HAIR = 'hair',
  MOUTH = 'mouth',
  UPPER_BODY = 'upper_body',
  LOWER_BODY = 'lower_body',
  FEET = 'feet',
  EARRING = 'earring',
  EYEWEAR = 'eyewear',
  HAT = 'hat',
  HELMET = 'helmet',
  MASK = 'mask',
  TIARA = 'tiara',
  TOP_HEAD = 'top_head'
}

export enum WearableRarity {
  UNIQUE = 'unique',
  MYTHIC = 'mythic',
  LEGENDARY = 'legendary',
  EPIC = 'epic',
  SWANKY = 'swanky',
  RARE = 'rare',
  UNCOMMON = 'uncommon',
  COMMON = 'common'
}

export const RARITY_COLOR_LIGHT = {
  [WearableRarity.UNIQUE]: '#FFE617',
  [WearableRarity.MYTHIC]: '#FB7DE3',
  [WearableRarity.LEGENDARY]: '#A657ED',
  [WearableRarity.EPIC]: '#6397F2',
  [WearableRarity.SWANKY]: '#3AD682',
  [WearableRarity.RARE]: '#3AD682',
  [WearableRarity.UNCOMMON]: '#FF8563',
  [WearableRarity.COMMON]: '#D4E0E0'
}

export const RARITY_COLOR = {
  [WearableRarity.UNIQUE]: '#FFB626',
  [WearableRarity.MYTHIC]: '#FF63E1',
  [WearableRarity.LEGENDARY]: '#842DDA',
  [WearableRarity.EPIC]: '#3D85E6',
  [WearableRarity.SWANKY]: '#36CF75',
  [WearableRarity.RARE]: '#36CF75',
  [WearableRarity.UNCOMMON]: '#ED6D4F',
  [WearableRarity.COMMON]: '#ABC1C1'
}

export type Wearable = {
  description: string
  category: WearableCategory
  rarity: WearableRarity
  bodyShapes: BodyShape[]
}

export enum BodyShape {
  MALE = 'BaseMale',
  FEMALE = 'BaseFemale'
}

export enum WearableGender {
  MALE = 'male',
  FEMALE = 'female'
}
