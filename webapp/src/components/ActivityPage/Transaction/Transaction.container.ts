import { connect } from 'react-redux'

import { RootState } from '../../../modules/reducer'
import { getContract } from '../../../modules/contract/selectors'
import { Contract } from '../../../modules/vendor/services'
import { MapStateProps } from './Transaction.types'
import Transaction from './Transaction'

const mapState = (state: RootState): MapStateProps => ({
  getContract: (query: Partial<Contract>) => getContract(state, query)
})

export default connect(mapState)(Transaction)
