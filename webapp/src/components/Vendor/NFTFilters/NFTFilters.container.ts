import { connect } from 'react-redux'

import { RootState } from '../../../modules/reducer'
import { getVendor } from '../../../modules/vendor/selectors'
import { MapStateProps } from './NFTFilters.types'
import NFTFilters from './NFTFilters'

const mapState = (state: RootState): MapStateProps => ({
  vendor: getVendor(state)
})

const mapDispatch = () => ({})

export default connect(mapState, mapDispatch)(NFTFilters)
