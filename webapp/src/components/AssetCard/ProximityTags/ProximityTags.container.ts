import { connect } from 'react-redux'
import { getProximities } from '../../../modules/proximity/selectors'
import { RootState } from '../../../modules/reducer'
import ProximityTags from './ProximityTags'
import { MapStateProps } from './ProximityTags.types'

const mapState = (state: RootState): MapStateProps => ({
  proximities: getProximities(state)
})

export default connect(mapState)(ProximityTags)
