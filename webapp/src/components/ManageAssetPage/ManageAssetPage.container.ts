import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { isConnecting } from 'decentraland-dapps/dist/modules/wallet/selectors'
import { goBack } from '../../modules/routing/actions'
import { RootState } from '../../modules/reducer'
import { getWallet } from '../../modules/wallet/selectors'
import { MapDispatchProps, MapStateProps } from './ManageAssetPage.types'
import { ManageAssetPage } from './ManageAssetPage'

const mapState = (state: RootState): MapStateProps => ({
  wallet: getWallet(state),
  isConnecting: isConnecting(state)
})

const mapDispatch = (dispatch: Dispatch): MapDispatchProps => ({
  onBack: (location?: string) => dispatch(goBack(location))
})

export default connect(mapState, mapDispatch)(ManageAssetPage)
