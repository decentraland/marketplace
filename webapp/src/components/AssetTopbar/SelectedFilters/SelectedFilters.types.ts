import { NFTCategory } from '@dcl/schemas'
import { browse } from '../../../modules/routing/actions'
import { BrowseOptions } from '../../../modules/routing/types'

export type Props = {
  category?: NFTCategory
  browseOptions: BrowseOptions
  isLandSection: boolean
  onBrowse: ActionFunction<typeof browse>
}
