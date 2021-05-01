import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { FETCH_AUTHORIZATIONS_REQUEST } from 'decentraland-dapps/dist/modules/authorization/actions'
import {
  getData as getAuthorizations,
  getLoading
} from 'decentraland-dapps/dist/modules/authorization/selectors'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { RootState } from '../../modules/reducer'
import { createOrderRequest } from '../../modules/order/actions'
import { MapStateProps, MapDispatchProps, MapDispatch } from './SellPage.types'
import SellPage from './SellPage'

const mapState = (state: RootState): MapStateProps => ({
  authorizations: getAuthorizations(state),
  isLoading: isLoadingType(getLoading(state), FETCH_AUTHORIZATIONS_REQUEST)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onNavigate: path => dispatch(push(path)),
  onCreateOrder: (nft, price, expiresAt) =>
    dispatch(createOrderRequest(nft, price, expiresAt))
})

export default connect(mapState, mapDispatch)(SellPage)
