import { Dispatch } from 'redux'
import { SetSearchAction } from '../../modules/nft/actions'
import { Props as OnSaleListItemProps } from './OnSaleListItem/OnSaleListItem.types'

export type Props = {
  items: OnSaleListItemProps[]
  isLoading: boolean
  search: string
  count: number
  onSearch: (val: string) => void
}

export type MapStateProps = Pick<
  Props,
  'items' | 'isLoading' | 'search' | 'count'
>
export type MapDispatchProps = Pick<Props, 'onSearch'>
export type MapDispatch = Dispatch<SetSearchAction>
