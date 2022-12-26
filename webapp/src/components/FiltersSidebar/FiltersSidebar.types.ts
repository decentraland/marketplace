import { Network, Rarity } from '@dcl/schemas'
import { BrowseOptions } from '../../modules/routing/types'

export type Props = {
  minPrice: string
  maxPrice: string
  rarities: Rarity[]
  network?: Network
  onBrowse: (options: BrowseOptions) => void
}

export type MapStateProps = Pick<Props, 'minPrice' | 'maxPrice' | 'rarities' | 'network'>
export type MapDispatchProps = Pick<Props, 'onBrowse'>
