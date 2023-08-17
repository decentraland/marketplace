import { connect } from 'react-redux'
import { getProximities } from '../../../modules/proximity/selectors'
import { RootState } from '../../../modules/reducer'
import ProximityTags from './ProximityTags'
import {
  MapStateProps,
  MapDispatchProps,
  MapDispatch
} from './ProximityTags.types'

const mapState = (state: RootState): MapStateProps => ({
  proximities: getProximities(state)
})

const mapDispatch = (_dispatch: MapDispatch): MapDispatchProps => ({})

export default connect(mapState, mapDispatch)(ProximityTags)
