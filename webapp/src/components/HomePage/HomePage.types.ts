import { CallHistoryMethodAction } from 'connected-react-router'
import { Dispatch } from 'redux'
import { fetchAssetsFromRoute, FetchAssetsFromRouteAction } from '../../modules/routing/actions'
import { getHomepage, getHomepageLoading } from '../../modules/ui/asset/homepage/selectors'

export type Props = {
  homepage: ReturnType<typeof getHomepage>
  homepageLoading: ReturnType<typeof getHomepageLoading>
  isCampaignHomepageBannerEnabled: boolean
  onNavigate: (path: string) => void
  onFetchAssetsFromRoute: typeof fetchAssetsFromRoute
}

export type MapStateProps = Pick<Props, 'homepage' | 'homepageLoading' | 'isCampaignHomepageBannerEnabled'>
export type MapDispatchProps = Pick<Props, 'onNavigate' | 'onFetchAssetsFromRoute'>
export type MapDispatch = Dispatch<CallHistoryMethodAction | FetchAssetsFromRouteAction>
