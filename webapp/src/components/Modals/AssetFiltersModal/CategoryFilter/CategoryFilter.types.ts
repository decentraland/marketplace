import { AssetType } from '../../../../modules/asset/types'
import { BrowseOptions } from '../../../../modules/routing/types'
import { View } from '../../../../modules/ui/types'
import { Section } from '../../../../modules/vendor/routing/types'

export type Props = {
  view?: View
  values: BrowseOptions
  assetType?: AssetType
  section?: Section
  onChange: (section: Section) => void
}

export type MapStateProps = Pick<Props, 'view' | 'section' | 'assetType'>
export type OwnProps = Pick<Props, 'values'>
