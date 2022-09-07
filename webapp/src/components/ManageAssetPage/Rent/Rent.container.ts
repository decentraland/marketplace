import { connect } from 'react-redux'
import { RootState } from '../../../modules/reducer'
import { MapStateProps } from './Rent.types'
import { Rent } from './Rent'

const mapState = (_state: RootState): MapStateProps => ({
  // TODO: Get the transaction status of the claim back land procedure
  isClaimingLandBack: false
})

export default connect(mapState)(Rent)
