import { connect } from 'react-redux'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'

import {
  OwnProps,
  MapStateProps,
  MapDispatch,
  MapDispatchProps
} from './NFTListPage.types'
import { RootState } from '../../modules/reducer'
import { fetchNFTsRequest, FETCH_NFTS_REQUEST } from '../../modules/nft/actions'
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
import NFTListPage from './NFTListPage'

const mapState = (state: RootState, ownProps: OwnProps): MapStateProps => {
  const { address } = ownProps

  let account
  if (address) {
    const accounts = getAccountData(state)
    account = accounts[address]
  }

  return {
    account,
    nfts: getAccountNFTs(state),
    page: getUIPage(state),
    section: getUISection(state),
    sortBy: getUISortBy(state),
    isLoading: isLoadingType(getLoading(state), FETCH_NFTS_REQUEST)
  }
}

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onFetchNFTs: options => dispatch(fetchNFTsRequest(options))
})

export default connect(mapState, mapDispatch)(NFTListPage)
