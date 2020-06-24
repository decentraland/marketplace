import { connect } from 'react-redux'
import { push } from 'connected-react-router'

import { RootState } from '../../modules/reducer'
import { fetchNFTsRequest } from '../../modules/nft/actions'
import {
  getPartnersSuperRare,
  isPartnersSuperRareLoading
} from '../../modules/ui/selectors'
import {
  MapDispatch,
  MapDispatchProps,
  MapStateProps
} from './PartnersPage.types'
import PartnersPage from './PartnersPage'

const mapState = (state: RootState): MapStateProps => ({
  superRare: getPartnersSuperRare(state),
  isSuperRareLoading: isPartnersSuperRareLoading(state)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onNavigate: path => dispatch(push(path)),
  onFetchNFTs: (...args) => dispatch(fetchNFTsRequest(...args))
})

export default connect(mapState, mapDispatch)(PartnersPage)
