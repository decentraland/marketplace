import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { isConnecting } from 'decentraland-dapps/dist/modules/wallet/selectors'
import { RootState } from '../../modules/reducer'
import { goBack } from '../../modules/routing/actions'
import { getWallet } from '../../modules/wallet/selectors'
import { ManageAssetPage } from './ManageAssetPage'
import { MapDispatchProps, MapStateProps } from './ManageAssetPage.types'

const mapState = (state: RootState): MapStateProps => ({
  wallet: getWallet(state),
  isConnecting: isConnecting(state)
})

const mapDispatch = (dispatch: Dispatch): MapDispatchProps => ({
  onBack: (location?: string) => dispatch(goBack(location))
})

export default connect(mapState, mapDispatch)(ManageAssetPage)
