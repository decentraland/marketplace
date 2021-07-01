import { connect } from 'react-redux'

import { RootState } from '../../../modules/reducer'
import { browseNFTs } from '../../../modules/routing/actions'
import { getVendor } from '../../../modules/routing/selectors'
import {
  MapStateProps,
  MapDispatch,
  MapDispatchProps
} from './NFTFilters.types'
import NFTFilters from './NFTFilters'

const mapState = (state: RootState): MapStateProps => ({
  vendor: getVendor(state)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onBrowse: options => dispatch(browseNFTs(options))
})

export default connect(mapState, mapDispatch)(NFTFilters)
