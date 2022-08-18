import { connect } from 'react-redux'
import { ContractName, getContract } from 'decentraland-transactions'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import {
  getData as getAuthorizations,
  getLoading as getAuthorizationLoading
} from 'decentraland-dapps/dist/modules/authorization/selectors'
import {
  grantTokenRequest,
  GRANT_TOKEN_REQUEST
} from 'decentraland-dapps/dist/modules/authorization/actions'
import { RootState } from '../../modules/reducer'
import {
  createRentalRequest,
  CREATE_RENTAL_REQUEST
} from '../../modules/rental/actions'
import { getAddress } from '../../modules/wallet/selectors'
import {
  getLoading as getRentalLoading,
  getError
} from '../../modules/rental/selectors'
import { getPendingAuthorizationTransactions } from '../../modules/transaction/selectors'
import { hasTransactionPending } from '../../modules/transaction/utils'
import {
  MapStateProps,
  MapDispatchProps,
  MapDispatch,
  OwnProps
} from './CreateRentalModal.types'
import CreateRentalModal from './CreateRentalModal'

const mapState = (state: RootState, { nft }: OwnProps): MapStateProps => ({
  address: getAddress(state),
  authorizations: getAuthorizations(state),
  isCreating: isLoadingType(getRentalLoading(state), CREATE_RENTAL_REQUEST),
  isGranting:
    isLoadingType(getAuthorizationLoading(state), GRANT_TOKEN_REQUEST) ||
    hasTransactionPending(
      getPendingAuthorizationTransactions(state),
      getContract(ContractName.Rentals, nft.chainId).address,
      nft.contractAddress
    ),
  error: getError(state)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onCreate: (nft, pricePerDay, periods, expiresAt) =>
    dispatch(createRentalRequest(nft, pricePerDay, periods, expiresAt)),
  onGrant: authorization => dispatch(grantTokenRequest(authorization))
})

export default connect(mapState, mapDispatch)(CreateRentalModal)
