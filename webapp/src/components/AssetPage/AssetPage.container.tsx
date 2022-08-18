import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { getIsRentalsEnabled } from '../../modules/features/selectors'
import { RootState } from '../../modules/reducer'
import { goBack } from '../../modules/routing/actions'
import AssetPage from './AssetPage'
import { MapStateProps, MapDispatchProps } from './AssetPage.types'

const mapState = (state: RootState): MapStateProps => ({
  isRentalsEnabled: getIsRentalsEnabled(state)
})

const mapDispatch = (dispatch: Dispatch): MapDispatchProps => ({
  onBack: (location?: string) => dispatch(goBack(location))
})

export default connect(mapState, mapDispatch)(AssetPage)
