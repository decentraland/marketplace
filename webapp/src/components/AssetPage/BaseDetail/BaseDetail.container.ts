import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { goBack } from '../../../modules/routing/actions'
import { MapDispatchProps } from './BaseDetail.types'
import BaseDetail from './BaseDetail'

const mapDispatch = (dispatch: Dispatch): MapDispatchProps => ({
  onBack: (location?: string) => dispatch(goBack(location))
})

export default connect(undefined, mapDispatch)(BaseDetail)
