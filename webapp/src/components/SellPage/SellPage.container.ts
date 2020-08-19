import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { RootState } from '../../modules/reducer'
import { createOrderRequest } from '../../modules/order/actions'
import {
  getAuthorizations,
  isLoading
} from '../../modules/authorization/selectors'
import { MapStateProps, MapDispatchProps, MapDispatch } from './SellPage.types'
import SellPage from './SellPage'

const mapState = (state: RootState): MapStateProps => ({
  authorizations: getAuthorizations(state),
  isLoading: isLoading(state)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onNavigate: path => dispatch(push(path)),
  onCreateOrder: (nft, price, expiresAt) =>
    dispatch(createOrderRequest(nft, price, expiresAt))
})

export default connect(mapState, mapDispatch)(SellPage)
