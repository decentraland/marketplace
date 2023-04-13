export const View = {
  MARKET: 'market',
  ACCOUNT: 'account',
  LISTS: 'lists',
  CURRENT_ACCOUNT: 'current_account',
  HOME_TRENDING_ITEMS: 'home_trending_items',
  HOME_SOLD_ITEMS: 'home_sold_items',
  HOME_NEW_ITEMS: 'home_new_items',
  HOME_WEARABLES: 'home_wearables',
  HOME_LAND: 'home_land',
  HOME_ENS: 'home_ens',
  PARTNERS_SUPER_RARE: 'super_rare',
  PARTNERS_MAKERS_PLACE: 'makers_place',
  PARTNERS_KNOWN_ORIGIN: 'known_origin',
  LOAD_MORE: 'load_more',
  ATLAS: 'atlas'
} as const

// eslint-disable-next-line @typescript-eslint/no-redeclare -- Intentionally naming the variable the same as the type
export type View = typeof View[keyof typeof View]
