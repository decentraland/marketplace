import { AssetType } from '../../../modules/asset/types'
import { fetchEventRequest } from '../../../modules/event/actions'
import { Section } from '../../../modules/vendor/routing/types'
import { VendorName } from '../../../modules/vendor/types'

export type Props = {
  vendor: VendorName
  assetType: AssetType
  section: Section
  isFullscreen?: boolean
  onFetchEventContracts: ActionFunction<typeof fetchEventRequest>
  contracts: Record<string, string[]>
  isCampaignBrowserEnabled: boolean
  campaignTag?: string
  additionalCampaignTags: string[]
  isLoadingCampaign?: boolean
  isFetchingEvent?: boolean
}
