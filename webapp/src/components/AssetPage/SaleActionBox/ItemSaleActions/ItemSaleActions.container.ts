import { connect } from 'react-redux'
import { RootState } from '../../../../modules/reducer'
import { getWallet } from '../../../../modules/wallet/selectors'
import { MapStateProps } from './ItemSaleActions.types'
import SaleRentActionBox from './ItemSaleActions'

const mapState = (state: RootState): MapStateProps => ({
  wallet: getWallet(state)
})

export default connect(mapState)(SaleRentActionBox)
