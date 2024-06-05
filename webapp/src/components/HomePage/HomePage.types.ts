import { Dispatch } from 'redux'
import { fetchAssetsFromRoute, FetchAssetsFromRouteAction } from '../../modules/routing/actions'
import { getHomepage, getHomepageLoading } from '../../modules/ui/asset/homepage/selectors'

export type Props = {
  homepage: ReturnType<typeof getHomepage>
  homepageLoading: ReturnType<typeof getHomepageLoading>
  isCampaignHomepageBannerEnabled: boolean
  onFetchAssetsFromRoute: typeof fetchAssetsFromRoute
}

export type MapStateProps = Pick<Props, 'homepage' | 'homepageLoading' | 'isCampaignHomepageBannerEnabled'>
export type MapDispatchProps = Pick<Props, 'onFetchAssetsFromRoute'>
export type MapDispatch = Dispatch<FetchAssetsFromRouteAction>
