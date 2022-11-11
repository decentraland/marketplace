import { connect } from 'react-redux'
import { isClaimingBackLandTransactionPending } from '../../../modules/ui/browse/selectors'
import { RootState } from '../../../modules/reducer'
import { MapStateProps, OwnProps } from './OnRentListElement.types'
import OnRentListElement from './OnRentListElement'

const mapState = (state: RootState, ownProps: OwnProps): MapStateProps => {
  return { isClaimingBackLandTransactionPending: isClaimingBackLandTransactionPending(state, ownProps.nft) }
}

export default connect(mapState)(OnRentListElement)
