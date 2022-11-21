import { connect } from 'react-redux'

import { RootState } from '../../../modules/reducer'
import { getVendor } from '../../../modules/routing/selectors'
import { getCount } from '../../../modules/ui/browse/selectors'
import { getContracts } from '../../../modules/contract/selectors'
import { MapStateProps } from './VendorMenu.types'
import VendorMenu from './VendorMenu'

const mapState = (state: RootState): MapStateProps => ({
  contracts: getContracts(state),
  count: getCount(state),
  currentVendor: getVendor(state)
})

const mapDispatch = () => ({})

export default connect(mapState, mapDispatch)(VendorMenu)
