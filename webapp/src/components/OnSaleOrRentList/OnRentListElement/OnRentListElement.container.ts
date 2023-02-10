import { connect } from 'react-redux'
import { RootState } from '../../../modules/reducer'
import { isClaimingBackLandTransactionPending } from '../../../modules/ui/browse/selectors'
import OnRentListElement from './OnRentListElement'
import { MapStateProps, OwnProps } from './OnRentListElement.types'

const mapState = (state: RootState, ownProps: OwnProps): MapStateProps => {
  return { isClaimingBackLandTransactionPending: isClaimingBackLandTransactionPending(state, ownProps.nft) }
}

export default connect(mapState)(OnRentListElement)
