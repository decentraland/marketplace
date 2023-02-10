import { connect } from 'react-redux'
import { getContracts } from '../../../modules/contract/selectors'
import { RootState } from '../../../modules/reducer'
import { getVendor } from '../../../modules/routing/selectors'
import { getCount } from '../../../modules/ui/browse/selectors'
import VendorMenu from './VendorMenu'
import { MapStateProps } from './VendorMenu.types'

const mapState = (state: RootState): MapStateProps => ({
  contracts: getContracts(state),
  count: getCount(state),
  currentVendor: getVendor(state)
})

const mapDispatch = () => ({})

export default connect(mapState, mapDispatch)(VendorMenu)
