import { connect } from 'react-redux'
import { RootState } from '../../../../modules/reducer'
import { getWallet } from '../../../../modules/wallet/selectors'
import ItemSaleActions from './ItemSaleActions'
import { MapStateProps } from './ItemSaleActions.types'

const mapState = (state: RootState): MapStateProps => {
  const wallet = getWallet(state)

  return {
    wallet
  }
}

export default connect(mapState)(ItemSaleActions)
