import { connect } from 'react-redux'
import { RootState } from '../../../../modules/reducer'
import { getWallet } from '../../../../modules/wallet/selectors'
import SaleRentActionBox from './ItemSaleActions'
import { MapStateProps } from './ItemSaleActions.types'

const mapState = (state: RootState): MapStateProps => ({
  wallet: getWallet(state)
})

export default connect(mapState)(SaleRentActionBox)
