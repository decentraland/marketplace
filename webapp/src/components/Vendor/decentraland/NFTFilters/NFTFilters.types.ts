import { Section, SortBy } from '../../../../modules/routing/search'
import {
  WearableRarity,
  WearableGender
} from '../../../../modules/nft/wearable/types'
import { ContractName } from '../../../../modules/vendor/types'

export type Props = {
  section: Section
  sortBy: SortBy
  search: string
  count?: number
  onlyOnSale?: boolean
  wearableRarities: WearableRarity[]
  wearableGenders: WearableGender[]
  contracts: ContractName[]
}

export type MapStateProps = Props
