import { connect } from 'react-redux'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'

import { RootState } from '../../modules/reducer'
import { FETCH_NFTS_REQUEST } from '../../modules/nft/actions'
import { getNFTs, getUIPage, getAssetsCount } from '../../modules/ui/selectors'
import { getLoading } from '../../modules/nft/selectors'
import { MapStateProps } from './NFTList.types'
import NFTList from './NFTList'

const mapState = (state: RootState): MapStateProps => ({
  nfts: getNFTs(state),
  page: getUIPage(state),
  count: getAssetsCount(state),
  isLoading: isLoadingType(getLoading(state), FETCH_NFTS_REQUEST)
})

const mapDispatch = () => ({})

export default connect(mapState, mapDispatch)(NFTList)
