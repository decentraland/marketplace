import React, { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getIsCampaignHomepageBannerEnabled } from '../../modules/features/selectors'
import { fetchAssetsFromRoute } from '../../modules/routing/actions'
import { getHomepage, getHomepageLoading } from '../../modules/ui/asset/homepage/selectors'
import HomePage from './HomePage'

const HomePageContainer: React.FC = () => {
  const dispatch = useDispatch()

  const homepage = useSelector(getHomepage)
  const homepageLoading = useSelector(getHomepageLoading)
  const isCampaignHomepageBannerEnabled = useSelector(getIsCampaignHomepageBannerEnabled)

  const handleFetchAssetsFromRoute = useCallback<ActionFunction<typeof fetchAssetsFromRoute>>(
    options => dispatch(fetchAssetsFromRoute(options)),
    [dispatch]
  )

  return (
    <HomePage
      homepage={homepage}
      homepageLoading={homepageLoading}
      isCampaignHomepageBannerEnabled={isCampaignHomepageBannerEnabled}
      onFetchAssetsFromRoute={handleFetchAssetsFromRoute}
    />
  )
}

export default HomePageContainer
