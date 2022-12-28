import { BrowseOptions } from '../../modules/routing/types'

export type Props = {
  minPrice: string
  maxPrice: string
  collection: string
  onlyOnSale: boolean | undefined
  onBrowse: (options: BrowseOptions) => void
}

export type MapStateProps = Pick<Props, 'minPrice' | 'maxPrice' | 'collection' | 'onlyOnSale'>
export type MapDispatchProps = Pick<Props, 'onBrowse'>
