import { connect } from 'react-redux'
import { RootState } from '../../../modules/reducer'
import { getProximity } from '../../../modules/proximity/selectors'
import {
  MapStateProps,
  MapDispatchProps,
  MapDispatch
} from './ParcelTags.types'
import ParcelTags from './ParcelTags'

const mapState = (state: RootState): MapStateProps => ({
  proximity: getProximity(state)
})

const mapDispatch = (_dispatch: MapDispatch): MapDispatchProps => ({})

export default connect(mapState, mapDispatch)(ParcelTags)
