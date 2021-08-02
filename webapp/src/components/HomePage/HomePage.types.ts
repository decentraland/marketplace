import { Dispatch } from 'redux'
import { CallHistoryMethodAction } from 'connected-react-router'
import {
  getHomepage,
  getHomepageLoading
} from '../../modules/ui/asset/homepage/selectors'
import {
  fetchNFTsFromRoute,
  FetchNFTsFromRouteAction
} from '../../modules/routing/actions'

export type Props = {
  homepage: ReturnType<typeof getHomepage>
  homepageLoading: ReturnType<typeof getHomepageLoading>
  onNavigate: (path: string) => void
  onFetchNFTsFromRoute: typeof fetchNFTsFromRoute
}

export type MapStateProps = Pick<Props, 'homepage' | 'homepageLoading'>
export type MapDispatchProps = Pick<
  Props,
  'onNavigate' | 'onFetchNFTsFromRoute'
>
export type MapDispatch = Dispatch<
  CallHistoryMethodAction | FetchNFTsFromRouteAction
>
