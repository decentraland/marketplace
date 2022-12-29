import { AssetType } from '../../../../modules/asset/types'
import { BrowseOptions } from '../../../../modules/routing/types'
import { Section } from '../../../../modules/vendor/routing/types'
import { View } from '../../../../modules/ui/types'

export type Props = {
  count: number | undefined
  search: string
  isMap: boolean
  view: View | undefined
  sortBy: string | undefined
  assetType: AssetType
  onlyOnSale: boolean | undefined
  onlyOnRent: boolean | undefined
  section: Section
  onBrowse: (options: BrowseOptions) => void
}

export type MapStateProps = Pick<
  Props, 'search' | 'isMap' | 'count' | 'view' | 'assetType' | 'onlyOnRent' | 'onlyOnSale' | 'sortBy' | 'section'
>

export type MapDispatchProps = Pick<Props, 'onBrowse'>
