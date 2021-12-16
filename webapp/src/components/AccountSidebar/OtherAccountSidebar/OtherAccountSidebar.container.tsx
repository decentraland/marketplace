import { connect } from 'react-redux'
import { RootState } from '../../../modules/reducer'
import { getAssetType } from '../../../modules/routing/selectors'
import { MapStateProps, MapDispatchProps } from './OtherAccountSidebar.types'
import OtherAccountSidebar from './OtherAccountSidebar'
import { BrowseOptions } from '../../../modules/routing/types'
import { browse } from '../../../modules/routing/actions'
import { Dispatch } from 'redux'
import { VendorName } from '../../../modules/vendor'

const mapState = (state: RootState): MapStateProps => ({
  assetType: getAssetType(state)
})

const mapDispatch = (dispatch: Dispatch): MapDispatchProps => ({
  onBrowse: (options: BrowseOptions) =>
    dispatch(browse({ vendor: VendorName.DECENTRALAND, ...options }))
})

export default connect(mapState, mapDispatch)(OtherAccountSidebar)
