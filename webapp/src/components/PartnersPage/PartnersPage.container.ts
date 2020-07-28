import { connect } from 'react-redux'
import { push } from 'connected-react-router'

import { RootState } from '../../modules/reducer'
import { fetchNFTsFromRoute } from '../../modules/routing/actions'
import {
  getPartnersSuperRare,
  isPartnersSuperRareLoading,
  getPartnersMakersPlace,
  isPartnersMakersPlaceLoading
} from '../../modules/ui/selectors'
import {
  MapDispatch,
  MapDispatchProps,
  MapStateProps
} from './PartnersPage.types'
import PartnersPage from './PartnersPage'

const mapState = (state: RootState): MapStateProps => ({
  superRare: getPartnersSuperRare(state),
  isSuperRareLoading: isPartnersSuperRareLoading(state),
  makersPlace: getPartnersMakersPlace(state),
  isMakersPlaceLoading: isPartnersMakersPlaceLoading(state)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onNavigate: path => dispatch(push(path)),
  onFetchNFTsFromRoute: options => dispatch(fetchNFTsFromRoute(options))
})

export default connect(mapState, mapDispatch)(PartnersPage)
