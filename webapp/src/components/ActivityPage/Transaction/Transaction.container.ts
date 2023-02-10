import { connect } from 'react-redux'
import { getContract } from '../../../modules/contract/selectors'
import { RootState } from '../../../modules/reducer'
import { Contract } from '../../../modules/vendor/services'
import Transaction from './Transaction'
import { MapStateProps } from './Transaction.types'

const mapState = (state: RootState): MapStateProps => ({
  getContract: (query: Partial<Contract>) => getContract(state, query)
})

export default connect(mapState)(Transaction)
