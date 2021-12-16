import { connect } from 'react-redux'
import { RootState } from '../../../modules/reducer'
import { getAssetType } from '../../../modules/routing/selectors'
import { MapStateProps } from './OtherAccountSidebar.types'
import OtherAccountSidebar from './OtherAccountSidebar'

const mapState = (state: RootState): MapStateProps => ({
  assetType: getAssetType(state)
})

export default connect(mapState)(OtherAccountSidebar)
