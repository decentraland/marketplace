import { Vendors } from '../vendor/types'

export const View = {
  MARKET: 'market',
  ACCOUNT: 'account',
  HOME_WEARABLES: 'home_wearables',
  HOME_LAND: 'home_land',
  HOME_ENS: 'home_ens',
  PARTNERS_SUPER_RARE: Vendors.SUPER_RARE,
  PARTNERS_MAKERS_PLACE: Vendors.MAKERS_PLACE,
  PARTNERS_KNOWN_ORIGIN: Vendors.KNOWN_ORIGIN,
  LOAD_MORE: 'load_more'
} as const

export type View = typeof View[keyof typeof View]
