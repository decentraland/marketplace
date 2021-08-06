import { connect } from 'react-redux'
import { push } from 'connected-react-router'

import { RootState } from '../../modules/reducer'
import { fetchAssetsFromRoute } from '../../modules/routing/actions'
import {
  getPartners,
  getPartnersLoading
} from '../../modules/ui/nft/partner/selectors'
import {
  MapDispatch,
  MapDispatchProps,
  MapStateProps
} from './PartnersPage.types'
import PartnersPage from './PartnersPage'

const mapState = (state: RootState): MapStateProps => ({
  partners: getPartners(state),
  partnersLoading: getPartnersLoading(state)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onNavigate: path => dispatch(push(path)),
  onFetchAssetsFromRoute: options => dispatch(fetchAssetsFromRoute(options))
})

export default connect(mapState, mapDispatch)(PartnersPage)
