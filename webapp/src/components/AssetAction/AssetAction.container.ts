import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { goBack } from '../../modules/routing/actions'
import AssetPage from './AssetAction'
import { MapDispatchProps } from './AssetAction.types'

const mapDispatch = (dispatch: Dispatch): MapDispatchProps => ({
  onBack: (location?: string) => dispatch(goBack(location))
})

export default connect(null, mapDispatch)(AssetPage)
