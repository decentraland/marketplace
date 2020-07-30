import { connect } from 'react-redux'

import { RootState } from '../../../modules/reducer'
import { getVendor } from '../../../modules/routing/selectors'
import { getAssetsCount } from '../../../modules/ui/nft/browse/selectors'
import { MapStateProps } from './VendorMenu.types'
import VendorMenu from './VendorMenu'

const mapState = (state: RootState): MapStateProps => ({
  count: getAssetsCount(state),
  currentVendor: getVendor(state)
})

const mapDispatch = () => ({})

export default connect(mapState, mapDispatch)(VendorMenu)
