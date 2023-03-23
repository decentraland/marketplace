import { getLocation } from 'connected-react-router'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { RootState } from '../../modules/reducer'
import { goBack } from '../../modules/routing/actions'
import AssetPage from './AssetPage'
import { MapDispatchProps } from './AssetPage.types'

const mapState = (state: RootState) => ({
  location: getLocation(state)
})

const mapDispatch = (dispatch: Dispatch): MapDispatchProps => ({
  onBack: (location?: string) => dispatch(goBack(location))
})

export default connect(mapState, mapDispatch)(AssetPage)
