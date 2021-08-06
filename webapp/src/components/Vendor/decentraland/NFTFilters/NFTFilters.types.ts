import { Network, Rarity } from '@dcl/schemas'
import { SortBy } from '../../../../modules/routing/types'
import { browse } from '../../../../modules/routing/actions'
import { WearableGender } from '../../../../modules/nft/wearable/types'
import { AssetType } from '../../../../modules/asset/types'

export type Props = {
  assetType: AssetType
  count?: number
  section: string
  sortBy?: SortBy
  search: string
  onlyOnSale?: boolean
  isMap?: boolean
  wearableRarities: Rarity[]
  wearableGenders: WearableGender[]
  contracts: string[]
  network?: Network
  onBrowse: typeof browse
}

export type MapStateProps = Pick<
  Props,
  | 'assetType'
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
export type MapDispatchProps = {}
export type OwnProps = Pick<Props, 'onBrowse' | 'isMap'>
