import { connect } from 'react-redux'
import { RootState } from '../../../modules/reducer'
import { getProximities } from '../../../modules/proximity/selectors'
import {
  MapStateProps,
  MapDispatchProps,
  MapDispatch
} from './ProximityHighlights.types'
import ProximityHighlights from './ProximityHighlights'

const mapState = (state: RootState): MapStateProps => ({
  proximities: getProximities(state)
})

const mapDispatch = (_dispatch: MapDispatch): MapDispatchProps => ({})

export default connect(mapState, mapDispatch)(ProximityHighlights)
