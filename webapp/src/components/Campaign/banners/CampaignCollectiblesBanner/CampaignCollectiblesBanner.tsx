import React from 'react'

import { CampaignBanner } from '../../CampaignBanner'
import { CampaignHomepageBanner } from '../CampaignHomepageBanner'

const CampaignCollectiblesBanner: React.FC = () => {
  return (
    <CampaignBanner>
      {/* We're using the same banner for this event. */}
      <CampaignHomepageBanner />
    </CampaignBanner>
  )
}

export default CampaignCollectiblesBanner
