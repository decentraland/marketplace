import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { isPending } from 'decentraland-dapps/dist/modules/transaction/utils'
import {
  getData as getAuthorizations,
  getTransactions,
  getLoading
} from 'decentraland-dapps/dist/modules/authorization/selectors'
import {
  FETCH_AUTHORIZATIONS_REQUEST,
  grantTokenRequest,
  revokeTokenRequest
} from 'decentraland-dapps/dist/modules/authorization/actions'

import { RootState } from '../../modules/reducer'
import { getWallet, isConnecting } from '../../modules/wallet/selectors'
import {
  MapStateProps,
  MapDispatch,
  MapDispatchProps
} from './SettingsPage.types'
import SettingsPage from './SettingsPage'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'

const mapState = (state: RootState): MapStateProps => {
  const wallet = getWallet(state)

  return {
    wallet,
    authorizations: getAuthorizations(state),
    pendingTransactions: getTransactions(state).filter(tx =>
      isPending(tx.status)
    ),
    isLoadingAuthorization: isLoadingType(
      getLoading(state),
      FETCH_AUTHORIZATIONS_REQUEST
    ),
    isConnecting: isConnecting(state)
  }
}

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onGrant: authorization => dispatch(grantTokenRequest(authorization)),
  onRevoke: authorization => dispatch(revokeTokenRequest(authorization)),
  onNavigate: path => dispatch(push(path))
})

export default connect(mapState, mapDispatch)(SettingsPage)
