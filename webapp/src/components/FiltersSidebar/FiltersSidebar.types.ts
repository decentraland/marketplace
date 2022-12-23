import { BrowseOptions } from '../../modules/routing/types'

export type Props = {
  minPrice: string
  maxPrice: string
  onBrowse: (options: BrowseOptions) => void
}

export type MapStateProps = Pick<Props, 'minPrice' | 'maxPrice'>
export type MapDispatchProps = Pick<Props, 'onBrowse'>
