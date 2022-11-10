import { connect } from 'react-redux'
import OnRentListElement from './OnRentListElement'
import { RootState } from '../../../modules/reducer'
import { MapStateProps, OwnProps } from './OnRentListElement.types'
import { getClaimingBackState } from '../../../modules/ui/browse/selectors'

const mapState = (state: RootState, ownProps: OwnProps): MapStateProps => {
  const claimingBackState = getClaimingBackState(state, ownProps.nft)
  return { claimingBackState: claimingBackState }
}

export default connect(mapState)(OnRentListElement)
