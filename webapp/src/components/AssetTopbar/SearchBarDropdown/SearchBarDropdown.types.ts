import { Dispatch } from 'redux'
import { NFTCategory } from '@dcl/schemas'
import {
  FetchCreatorsAccountRequestAction,
  fetchCreatorsAccountRequest
} from '../../../modules/account/actions'
import { CreatorAccount } from '../../../modules/account/types'

export type SearchBarDropdownProps = {
  searchTerm: string
  category: NFTCategory | undefined
  onSearch: ({
    value,
    contractAddresses
  }: {
    value?: string
    contractAddresses?: string[]
  }) => void
  fetchedCreators: CreatorAccount[]
  onFetchCreators: typeof fetchCreatorsAccountRequest
  isLoadingCreators: boolean
  onClickOutside: (event: MouseEvent) => void
}

export enum SearchTab {
  WEARABLES = 'wearables',
  EMOTES = 'emotes',
  CREATORS = 'creators',
  COLLECTIONS = 'collections'
}

export type MapStateProps = Pick<
  SearchBarDropdownProps,
  'fetchedCreators' | 'isLoadingCreators'
>

export type MapDispatchProps = Pick<SearchBarDropdownProps, 'onFetchCreators'>
export type MapDispatch = Dispatch<FetchCreatorsAccountRequestAction>
