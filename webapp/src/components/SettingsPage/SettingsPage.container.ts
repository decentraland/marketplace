import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import {
  getData as getAuthorizations,
  getLoading,
  getError
} from 'decentraland-dapps/dist/modules/authorization/selectors'
import {
  FETCH_AUTHORIZATIONS_REQUEST,
  grantTokenRequest,
  revokeTokenRequest
} from 'decentraland-dapps/dist/modules/authorization/actions'

import { RootState } from '../../modules/reducer'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { getPendingAuthorizationTransactions } from '../../modules/transaction/selectors'
import { getWallet, isConnecting } from '../../modules/wallet/selectors'
import {
  MapStateProps,
  MapDispatch,
  MapDispatchProps
} from './SettingsPage.types'
import SettingsPage from './SettingsPage'

const mapState = (state: RootState): MapStateProps => {
  const wallet = getWallet(state)

  const error = getError(state)

  const hasError = !!error && !error.includes('denied transaction signature')

  return {
    wallet,
    authorizations: getAuthorizations(state),
    pendingTransactions: getPendingAuthorizationTransactions(state),
    isLoadingAuthorization: isLoadingType(
      getLoading(state),
      FETCH_AUTHORIZATIONS_REQUEST
    ),
    isConnecting: isConnecting(state),
    hasError
  }
}

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onGrant: authorization => dispatch(grantTokenRequest(authorization)),
  onRevoke: authorization => dispatch(revokeTokenRequest(authorization)),
  onNavigate: path => dispatch(push(path))
})

export default connect(mapState, mapDispatch)(SettingsPage)
