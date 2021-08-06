import { SortBy } from '../../../../modules/routing/types'
import { browseNFTs } from '../../../../modules/routing/actions'

export type Props = {
  section: string
  sortBy?: SortBy
  onlyOnSale?: boolean
  onBrowse: typeof browseNFTs
}

export type MapStateProps = Pick<Props, 'section' | 'sortBy' | 'onlyOnSale'>
export type OwnProps = Pick<Props, 'onBrowse'>
