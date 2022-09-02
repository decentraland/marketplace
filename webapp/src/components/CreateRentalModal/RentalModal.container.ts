import { connect } from 'react-redux'
import { getData as getAuthorizations } from 'decentraland-dapps/dist/modules/authorization/selectors'
import { RootState } from '../../modules/reducer'
import { getAddress } from '../../modules/wallet/selectors'
import {
  MapStateProps,
  MapDispatchProps,
  MapDispatch
} from './RentalModal.types'
import RentalModal from './RentalModal'

const mapState = (state: RootState): MapStateProps => ({
  address: getAddress(state),
  authorizations: getAuthorizations(state)
})

const mapDispatch = (_dispatch: MapDispatch): MapDispatchProps => ({})

export default connect(mapState, mapDispatch)(RentalModal)
