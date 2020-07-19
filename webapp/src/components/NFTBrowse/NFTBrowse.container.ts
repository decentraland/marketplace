import { connect } from 'react-redux'

import { RootState } from '../../modules/reducer'
import { fetchNFTsFromRoute } from '../../modules/routing/actions'
import { getOnlyOnSale, getIsMap } from '../../modules/routing/selectors'
import { MapDispatch, MapDispatchProps, MapStateProps } from './NFTBrowse.types'
import NFTBrowse from './NFTBrowse'

const mapState = (state: RootState): MapStateProps => ({
  onlyOnSale: getOnlyOnSale(state),
  isMap: getIsMap(state)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onFetchNFTsFromRoute: options => dispatch(fetchNFTsFromRoute(options))
})

export default connect(mapState, mapDispatch)(NFTBrowse)
