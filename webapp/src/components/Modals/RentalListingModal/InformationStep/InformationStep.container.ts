import { connect } from 'react-redux'
import { MapStateProps, OwnProps } from './InformationStep.types'
import InformationStep from './InformationStep'

const mapState = (state: OwnProps): MapStateProps => state

export default connect(mapState, null)(InformationStep)
