import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { goBack } from '../../modules/routing/actions'
import { RootState } from '../../modules/reducer'
import { MapDispatchProps, MapStateProps } from './ManageAssetPage.types'
import { ManageAssetPage } from './ManageAssetPage'
import { getAddress, isConnecting } from '../../modules/wallet/selectors'

const mapState = (state: RootState): MapStateProps => ({
  userAddress: getAddress(state),
  isConnecting: isConnecting(state)
})

const mapDispatch = (dispatch: Dispatch): MapDispatchProps => ({
  onBack: (location?: string) => dispatch(goBack(location))
})

export default connect(mapState, mapDispatch)(ManageAssetPage)
