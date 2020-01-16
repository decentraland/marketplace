import { connect } from 'react-redux'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'

import {
  OwnProps,
  MapStateProps,
  MapDispatch,
  MapDispatchProps
} from './AccountNFTs.types'
import AccountNFTs from './AccountNFTs'
import { RootState } from '../../modules/reducer'
import {
  fetchAccountRequest,
  FETCH_ACCOUNT_REQUEST
} from '../../modules/account/actions'
import {
  getData as getAccountData,
  getLoading
} from '../../modules/account/selectors'
import { getData as getNFTData } from '../../modules/nft/selectors'
import { getData as getOrderData } from '../../modules/order/selectors'

const mapState = (state: RootState, ownProps: OwnProps): MapStateProps => {
  const { address } = ownProps
  const accounts = getAccountData(state)
  const account = accounts[address]

  return {
    account,
    nfts: getNFTData(state),
    orders: getOrderData(state),
    isLoading: isLoadingType(getLoading(state), FETCH_ACCOUNT_REQUEST)
  }
}

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onFetchAccount: options => dispatch(fetchAccountRequest(options))
})

export default connect(
  mapState,
  mapDispatch
)(AccountNFTs)
