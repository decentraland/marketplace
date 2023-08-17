import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { goBack } from '../../../modules/routing/actions'
import OnBack from './OnBack'
import { MapDispatchProps } from './OnBack.types'

const mapDispatch = (dispatch: Dispatch): MapDispatchProps => ({
  onBack: (location?: string) => dispatch(goBack(location))
})

export default connect(null, mapDispatch)(OnBack)
