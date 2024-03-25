import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { FETCH_AUTHORIZATIONS_REQUEST } from 'decentraland-dapps/dist/modules/authorization/actions'
import { getData as getAuthorizations, getLoading, getError } from 'decentraland-dapps/dist/modules/authorization/selectors'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { isConnecting } from 'decentraland-dapps/dist/modules/wallet/selectors'
import { fetchContractsRequest, FETCH_CONTRACTS_REQUEST } from '../../modules/contract/actions'
import { getContract, getHasFetched, getLoading as getContractLoading } from '../../modules/contract/selectors'
import { RootState } from '../../modules/reducer'
import { isUserCanceled, isUserDeniedSignatureError, isContractAccountError } from '../../modules/transaction/utils'
import { Contract } from '../../modules/vendor/services'
import { getWallet } from '../../modules/wallet/selectors'
import SettingsPage from './SettingsPage'
import { MapStateProps, MapDispatch, MapDispatchProps } from './SettingsPage.types'

const mapState = (state: RootState): MapStateProps => {
  const wallet = getWallet(state)

  const error = getError(state)

  // TODO: Change this to use ErrorCodes. Needs an overhaul on decentraland-dapps
  const hasError = !!error && !isUserCanceled(error) && !isUserDeniedSignatureError(error) && !isContractAccountError(error)

  return {
    wallet,
    authorizations: getAuthorizations(state),
    isLoading:
      isLoadingType(getLoading(state), FETCH_AUTHORIZATIONS_REQUEST) || isLoadingType(getContractLoading(state), FETCH_CONTRACTS_REQUEST),
    isConnecting: isConnecting(state),
    hasError,
    hasFetchedContracts: getHasFetched(state),
    getContract: (query: Partial<Contract>) => getContract(state, query)
  }
}

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onNavigate: path => dispatch(push(path)),
  onFetchContracts: () => dispatch(fetchContractsRequest())
})

export default connect(mapState, mapDispatch)(SettingsPage)
