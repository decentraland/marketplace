import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { RootState } from '../../../modules/reducer'
import { claimLandRequest } from '../../../modules/rental/actions'
import {
  isClaimingLand,
  isSigningTransaction,
  getError
} from '../../../modules/rental/selectors'
import {
  MapDispatchProps,
  MapStateProps,
  OwnProps
} from './ClaimLandModal.types'
import ClaimLandModal from './ClaimLandModal'

const mapState = (state: RootState): MapStateProps => {
  return {
    isClaimingLand: isClaimingLand(state),
    isSigningTransaction: isSigningTransaction(state),
    error: getError(state)
  }
}

const mapDispatch = (
  dispatch: Dispatch,
  ownProps: OwnProps
): MapDispatchProps => {
  return {
    onClaimLand: () =>
      dispatch(
        claimLandRequest(ownProps.metadata.nft, ownProps.metadata.rental)
      )
  }
}

export default connect(mapState, mapDispatch)(ClaimLandModal)
