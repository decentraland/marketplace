import { AssetType } from '../../../../modules/asset/types'
import { View } from '../../../../modules/ui/types'
import { isLandSection } from '../../../../modules/ui/utils'
import { Section, Sections } from '../../../../modules/vendor/routing/types'

export function getAvailableSections(view?: View, section?: Section, assetType?: AssetType) {
  if (view === View.ACCOUNT && assetType === AssetType.ITEM) {
    return [Sections.decentraland.WEARABLES, Sections.decentraland.EMOTES]
  }

  if (view === View.ACCOUNT && assetType === AssetType.NFT) {
    return [Sections.decentraland.ALL]
  }

  if (isLandSection(section)) {
    return [Sections.decentraland.LAND]
  }

  return [Sections.decentraland.WEARABLES, Sections.decentraland.EMOTES, Sections.decentraland.ENS]
}
