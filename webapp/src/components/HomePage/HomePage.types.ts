import { fetchAssetsFromRoute } from '../../modules/routing/actions'
import { getHomepage, getHomepageLoading } from '../../modules/ui/asset/homepage/selectors'

export type Props = {
  homepage: ReturnType<typeof getHomepage>
  homepageLoading: ReturnType<typeof getHomepageLoading>
  isCampaignHomepageBannerEnabled: boolean
  onFetchAssetsFromRoute: ActionFunction<typeof fetchAssetsFromRoute>
}
