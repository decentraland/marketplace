import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { openModal } from 'decentraland-dapps/dist/modules/modal/actions'
import { RootState } from '../../../modules/reducer'
import { isClaimingLand } from '../../../modules/rental/selectors'
import { MapStateProps, MapDispatchProps, OwnProps } from './Rent.types'
import { Rent } from './Rent'

const mapState = (state: RootState): MapStateProps => ({
  isClaimingLandBack: isClaimingLand(state)
})

const mapDispatch = (
  dispatch: Dispatch,
  ownProps: OwnProps
): MapDispatchProps => ({
  onClaimLand: () =>
    dispatch(
      openModal('ClaimLandModal', {
        nft: ownProps.nft,
        rental: ownProps.rental
      })
    )
})

export default connect(mapState, mapDispatch)(Rent)
