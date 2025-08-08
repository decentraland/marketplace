import { ModalProps } from 'decentraland-ui/dist/components/Modal/Modal'
import { AssetType } from '../../../modules/asset/types'
import { browse } from '../../../modules/routing/actions'
import { BrowseOptions } from '../../../modules/routing/types'
import { View } from '../../../modules/ui/types'

export type Props = ModalProps & {
  hasFiltersEnabled: boolean
  view?: View
  assetType: AssetType
  browseOptions: BrowseOptions
  onBrowse: ActionFunction<typeof browse>
}
