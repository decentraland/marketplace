import { connect } from 'react-redux'

import { RootState } from '../../../modules/reducer'
import { getWallet } from '../../../modules/wallet/selectors'
import { MapStateProps } from './ItemDetail.types'
import ItemDetail from './ItemDetail'

const mapState = (state: RootState): MapStateProps => ({
  wallet: getWallet(state)
})

const mapDispatch = () => ({})

export default connect(mapState, mapDispatch)(ItemDetail)
