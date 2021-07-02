import { connect } from 'react-redux'

import { RootState } from '../../modules/reducer'
import { browseNFTs } from '../../modules/routing/actions'
import { getVendor } from '../../modules/routing/selectors'
import {
  MapDispatch,
  MapDispatchProps,
  MapStateProps
} from './VendorStrip.types'
import VendorStrip from './VendorStrip'

const mapState = (state: RootState): MapStateProps => ({
  vendor: getVendor(state)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onBrowse: options => dispatch(browseNFTs(options))
})

export default connect(mapState, mapDispatch)(VendorStrip)
