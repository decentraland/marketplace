import { connect } from 'react-redux'
import { RootState } from '../../../modules/reducer'
import { getProximities } from '../../../modules/proximity/selectors'
import { MapStateProps } from './ProximityHighlights.types'
import ProximityHighlights from './ProximityHighlights'

const mapState = (state: RootState): MapStateProps => ({
  proximities: getProximities(state)
})

export default connect(mapState)(ProximityHighlights)
