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
  /** Items the campaign names one by one. When it names any, they are what the page selects. */
  campaignItemIds: string[]
  additionalCampaignTags: string[]
  isLoadingCampaign?: boolean
  isFetchingEvent?: boolean
}
