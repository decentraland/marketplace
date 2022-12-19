import { AssetType } from '../../modules/asset/types'
import { Section } from '../../modules/vendor/routing/types'
import { VendorName } from '../../modules/vendor/types'

export type Props = {
  vendor: VendorName
  assetType: AssetType
  section: Section
  isCampaignCollectiblesBannerEnabled: boolean
  isFullscreen?: boolean
}

export type MapStateProps = Pick<
  Props,
  | 'vendor'
  | 'isFullscreen'
  | 'assetType'
  | 'section'
  | 'isCampaignCollectiblesBannerEnabled'
>
export type MapDispatchProps = {}
export type MapDispatch = {}
