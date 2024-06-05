import { connect } from 'react-redux'
import { openModal } from 'decentraland-dapps/dist/modules/modal/actions'
import { isConnecting } from 'decentraland-dapps/dist/modules/wallet/selectors'
import { RootState } from '../../../modules/reducer'
import { getWallet } from '../../../modules/wallet/selectors'
import ClaimNamePage from './ClaimNamePage'
import { MapDispatch, MapDispatchProps, MapStateProps } from './ClaimNamePage.types'

const mapState = (state: RootState): MapStateProps => ({
  isConnecting: isConnecting(state),
  wallet: getWallet(state)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onClaim: (name: string) => dispatch(openModal('ClaimNameFatFingerModal', { name }))
})

export default connect(mapState, mapDispatch)(ClaimNamePage)
