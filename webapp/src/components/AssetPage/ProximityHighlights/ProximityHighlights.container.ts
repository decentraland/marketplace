import { connect } from 'react-redux'
import { getProximities } from '../../../modules/proximity/selectors'
import { RootState } from '../../../modules/reducer'
import ProximityHighlights from './ProximityHighlights'
import { MapStateProps } from './ProximityHighlights.types'

const mapState = (state: RootState): MapStateProps => ({
  proximities: getProximities(state)
})

export default connect(mapState)(ProximityHighlights)
