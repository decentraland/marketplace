import { AssetType } from '../../modules/asset/types'
import { browse, fetchAssetsFromRoute } from '../../modules/routing/actions'
import { setView } from '../../modules/ui/actions'
import { View } from '../../modules/ui/types'
import { Section } from '../../modules/vendor/routing/types'
import { VendorName } from '../../modules/vendor/types'
import { AssetStatusFilter } from '../../utils/filters'

export type Props = {
  vendor: VendorName
  view: View
  assetType: AssetType
  viewInState?: View // This is used to know when the view prop has been set in the app state
  address?: string
  contracts?: string[]
  isMap?: boolean
  isFullscreen?: boolean
  section?: Section
  sections?: Section[]
  status?: AssetStatusFilter
  onSetView: ActionFunction<typeof setView>
  onFetchAssetsFromRoute: ActionFunction<typeof fetchAssetsFromRoute>
  onBrowse: ActionFunction<typeof browse>
  onlyOnSale?: boolean
  onlySmart?: boolean
  disableSearchDropdown?: boolean
  onlyOnRent?: boolean
}

export type ContainerProps = Pick<
  Props,
  'vendor' | 'address' | 'isFullscreen' | 'view' | 'section' | 'sections' | 'contracts' | 'disableSearchDropdown'
>
