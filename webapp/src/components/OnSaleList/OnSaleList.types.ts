import { Props as OnSaleListItemProps } from './OnSaleListItem/OnSaleListItem.types'

export type Props = {
  items: OnSaleListItemProps[]
  isLoading: boolean
}

export type MapStateProps = Pick<Props, 'items' | 'isLoading'>
