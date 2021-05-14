export const View = {
  MARKET: 'market',
  ACCOUNT: 'account',
  HOME_WEARABLES: 'home_wearables',
  HOME_LAND: 'home_land',
  HOME_ENS: 'home_ens',
  PARTNERS_SUPER_RARE: 'super_rare',
  PARTNERS_MAKERS_PLACE: 'makers_place',
  PARTNERS_KNOWN_ORIGIN: 'known_origin',
  LOAD_MORE: 'load_more',
  ATLAS: 'atlas'
} as const

export type View = typeof View[keyof typeof View]
