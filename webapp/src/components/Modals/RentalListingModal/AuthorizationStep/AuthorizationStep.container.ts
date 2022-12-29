import { connect } from 'react-redux'
import { ContractName, getContract } from 'decentraland-transactions'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { getError } from 'decentraland-dapps/dist/modules/authorization/selectors'
import { getLoading as getAuthorizationLoading } from 'decentraland-dapps/dist/modules/authorization/selectors'
import {
  fetchAuthorizationsRequest,
  FETCH_AUTHORIZATIONS_REQUEST,
  grantTokenRequest,
  GRANT_TOKEN_REQUEST
} from 'decentraland-dapps/dist/modules/authorization/actions'
import { RootState } from '../../../../modules/reducer'
import { getAddress } from '../../../../modules/wallet/selectors'
import { getPendingAuthorizationTransactions } from '../../../../modules/transaction/selectors'
import { hasTransactionPending } from '../../../../modules/transaction/utils'
import {
  MapStateProps,
  MapDispatchProps,
  MapDispatch,
  OwnProps
} from './AuthorizationStep.types'
import AuthorizationStep from './AuthorizationStep'

const mapState = (state: RootState, { nft }: OwnProps): MapStateProps => ({
  address: getAddress(state)!,
  isAuthorizing: hasTransactionPending(
    getPendingAuthorizationTransactions(state),
    getContract(ContractName.Rentals, nft.chainId).address,
    nft.contractAddress
  ),
  isConfirmingAuthorization: isLoadingType(
    getAuthorizationLoading(state),
    GRANT_TOKEN_REQUEST
  ),
  error: getError(state),
  isFetchingAuthorizations: isLoadingType(
    getAuthorizationLoading(state),
    FETCH_AUTHORIZATIONS_REQUEST
  )
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onAuthorize: authorization => dispatch(grantTokenRequest(authorization)),
  onFetchAuthorizations: authorizations =>
    dispatch(fetchAuthorizationsRequest(authorizations))
})

export default connect(mapState, mapDispatch)(AuthorizationStep)
