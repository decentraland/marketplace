import { goBack } from 'connected-react-router'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import AssetPage from './AssetPage'
import { MapDispatchProps } from './AssetPage.types'

const mapDispatch = (dispatch: Dispatch): MapDispatchProps => ({
  onBack: () => dispatch(goBack())
})

export default connect(null, mapDispatch)(AssetPage)
