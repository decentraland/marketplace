import { connect } from 'react-redux'
import { RootState } from '../../../modules/reducer'
import { getProximities } from '../../../modules/proximity/selectors'
import { MapStateProps } from './ProximityTags.types'
import ProximityTags from './ProximityTags'

const mapState = (state: RootState): MapStateProps => ({
  proximities: getProximities(state)
})

export default connect(mapState)(ProximityTags)
