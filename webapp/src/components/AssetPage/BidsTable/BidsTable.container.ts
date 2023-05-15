import { MapStateProps } from './BidsTable.types'
import { RootState } from '../../../modules/reducer'
import { getAddress } from '../../../modules/wallet/selectors'
import { connect } from 'react-redux'
import BidsTable from './BidsTable'

const mapState = (state: RootState): MapStateProps => ({
  address: getAddress(state)
})

export default connect(mapState)(BidsTable)
