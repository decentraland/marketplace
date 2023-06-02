import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { goBack } from '../../../modules/routing/actions'
import { MapDispatchProps } from './OnBack.types'
import OnBack from './OnBack'

const mapDispatch = (dispatch: Dispatch): MapDispatchProps => ({
  onBack: (location?: string) => dispatch(goBack(location))
})

export default connect(null, mapDispatch)(OnBack)
