import { Network } from '@dcl/schemas'
import { Section, SortBy } from '../../../../modules/routing/types'
import { browse } from '../../../../modules/routing/actions'
import {
  WearableRarity,
  WearableGender
} from '../../../../modules/nft/wearable/types'

export type Props = {
  count?: number
  section: Section
  sortBy?: SortBy
  search: string
  onlyOnSale?: boolean
  isMap?: boolean
  wearableRarities: WearableRarity[]
  wearableGenders: WearableGender[]
  contracts: string[]
  network?: Network
  onBrowse: typeof browse
}

export type MapStateProps = Pick<
  Props,
  | 'count'
  | 'section'
  | 'sortBy'
  | 'search'
  | 'onlyOnSale'
  | 'isMap'
  | 'wearableRarities'
  | 'wearableGenders'
  | 'contracts'
  | 'network'
>
export type OwnProps = Pick<Props, 'onBrowse'>
