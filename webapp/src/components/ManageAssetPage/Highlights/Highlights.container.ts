import { connect } from 'react-redux'
import { getProximities } from '../../../modules/proximity/selectors'
import { RootState } from '../../../modules/reducer'
import { Highlights } from './Highlights'
import { MapStateProps } from './Highlights.types'

const mapState = (state: RootState): MapStateProps => ({
  proximities: getProximities(state)
})

export default connect(mapState)(Highlights)
