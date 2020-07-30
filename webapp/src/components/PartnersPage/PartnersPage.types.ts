import { Dispatch } from 'redux'
import { CallHistoryMethodAction } from 'connected-react-router'
import {
  getPartners,
  getPartnersLoading
} from '../../modules/ui/nft/partner/selectors'
import {
  fetchNFTsFromRoute,
  FetchNFTsFromRouteAction
} from '../../modules/routing/actions'

export type Props = {
  partners: ReturnType<typeof getPartners>
  partnersLoading: ReturnType<typeof getPartnersLoading>
  onNavigate: (path: string) => void
  onFetchNFTsFromRoute: typeof fetchNFTsFromRoute
}

export type MapStateProps = Pick<Props, 'partners' | 'partnersLoading'>
export type MapDispatchProps = Pick<
  Props,
  'onNavigate' | 'onFetchNFTsFromRoute'
>
export type MapDispatch = Dispatch<
  CallHistoryMethodAction | FetchNFTsFromRouteAction
>
