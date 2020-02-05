import { connect } from 'react-redux'

import { RootState } from '../../modules/reducer'
import TransactionHistory from './TransactionHistory'

const mapState = (_: RootState) => ({})

const mapDispatch = () => ({})

export default connect(mapState, mapDispatch)(TransactionHistory)
