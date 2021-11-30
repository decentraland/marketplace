import { goBack } from 'connected-react-router'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { MapDispatchProps } from './AssetPage.types'
import AssetPage from './AssetPage'

const mapDispatch = (dispatch: Dispatch): MapDispatchProps => ({
  onBack: () => dispatch(goBack())
})

export default connect(null, mapDispatch)(AssetPage)
