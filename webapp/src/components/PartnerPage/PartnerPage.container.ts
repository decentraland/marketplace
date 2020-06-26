import { connect } from 'react-redux'

import { RootState } from '../../modules/reducer'
import { getVendor } from '../../modules/vendor/selectors'
import { MapStateProps } from './PartnerPage.types'
import PartnerPage from './PartnerPage'

const mapState = (state: RootState): MapStateProps => ({
  vendor: getVendor(state)
})

const mapDispatch = () => ({})

export default connect(mapState, mapDispatch)(PartnerPage)
