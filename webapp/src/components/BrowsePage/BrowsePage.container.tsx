import React from 'react'
import { useSelector } from 'react-redux'
import { getIsCampaignCollectiblesBannerEnabled } from '../../modules/features/selectors'
import { useGetBrowseOptions } from '../../modules/routing/hooks'
import BrowsePage from './BrowsePage'

const BrowsePageContainer: React.FC = () => {
  const { vendor, assetType, section, isFullscreen, contracts } = useGetBrowseOptions()
  const isCampaignCollectiblesBannerEnabled: boolean = useSelector(getIsCampaignCollectiblesBannerEnabled)

  return (
    <BrowsePage
      vendor={vendor}
      assetType={assetType}
      section={section}
      isCampaignCollectiblesBannerEnabled={isCampaignCollectiblesBannerEnabled}
      isFullscreen={isFullscreen}
      contracts={contracts}
    />
  )
}

export default BrowsePageContainer
