import { Dispatch } from 'redux'

import {
  fetchNFTsRequest,
  FetchNFTsRequestAction
} from '../../modules/nft/actions'
import { View } from '../../modules/ui/types'
import { Section, SortBy } from '../../modules/routing/search'
import {
  WearableRarity,
  WearableGender
} from '../../modules/nft/wearable/types'
import { ContractName } from '../../modules/vendor/types'

export type Props = {
  section: Section
  sortBy: SortBy
  search: string
  onlyOnSale?: boolean
  wearableRarities: WearableRarity[]
  wearableGenders: WearableGender[]
  contracts: ContractName[]
  view: View
  page: number
  address?: string
  defaultOnlyOnSale: boolean
  onFetchNFTs: typeof fetchNFTsRequest
}

export type MapStateProps = Pick<
  Props,
  | 'page'
  | 'section'
  | 'sortBy'
  | 'onlyOnSale'
  | 'search'
  | 'wearableRarities'
  | 'wearableGenders'
  | 'contracts'
>
export type MapDispatchProps = Pick<Props, 'onFetchNFTs'>
export type MapDispatch = Dispatch<FetchNFTsRequestAction>
export type OwnProps = Pick<Props, 'address' | 'defaultOnlyOnSale' | 'view'>
