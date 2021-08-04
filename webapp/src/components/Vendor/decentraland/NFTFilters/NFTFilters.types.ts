import { Network, Rarity } from '@dcl/schemas'
import { Section, SortBy } from '../../../../modules/routing/types'
import { browseNFTs } from '../../../../modules/routing/actions'
import { WearableGender } from '../../../../modules/nft/wearable/types'
import { AssetType } from '../../../../modules/asset/types'

export type Props = {
  resultType: AssetType
  count?: number
  section: Section
  sortBy?: SortBy
  search: string
  onlyOnSale?: boolean
  isMap?: boolean
  wearableRarities: Rarity[]
  wearableGenders: WearableGender[]
  contracts: string[]
  network?: Network
  onBrowse: typeof browseNFTs
}

export type MapStateProps = Pick<
  Props,
  | 'resultType'
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
