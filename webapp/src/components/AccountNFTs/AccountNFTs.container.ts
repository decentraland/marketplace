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
  getAccountNFTs,
  getUIPage,
  getUISection,
  getUISortBy
} from '../../modules/ui/selectors'
import {
  getData as getAccountData,
  getLoading
} from '../../modules/account/selectors'

const mapState = (state: RootState, ownProps: OwnProps): MapStateProps => {
  const { address } = ownProps
  const accounts = getAccountData(state)
  const account = accounts[address]

  return {
    account,
    nfts: getAccountNFTs(state),
    page: getUIPage(state),
    section: getUISection(state),
    sortBy: getUISortBy(state),
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
