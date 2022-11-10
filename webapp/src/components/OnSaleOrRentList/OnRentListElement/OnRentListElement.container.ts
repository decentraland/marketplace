import { connect } from 'react-redux'
import OnRentListElement from './OnRentListElement'
import { RootState } from '../../../modules/reducer'
import { MapStateProps, OwnProps } from './OnRentListElement.types'
import { isClaimingBackLandTransactionPending } from '../../../modules/ui/browse/selectors'

const mapState = (state: RootState, ownProps: OwnProps): MapStateProps => {
  return { isClaimingBackLandTransactionPending: isClaimingBackLandTransactionPending(state, ownProps.nft) }
}

export default connect(mapState)(OnRentListElement)
