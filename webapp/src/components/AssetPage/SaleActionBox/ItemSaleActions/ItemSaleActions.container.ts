import { connect } from 'react-redux'
import { RootState } from '../../../../modules/reducer'
import { getWallet } from '../../../../modules/wallet/selectors'
import { MapStateProps } from './ItemSaleActions.types'
import ItemSaleActions from './ItemSaleActions'

const mapState = (state: RootState): MapStateProps => {
  const wallet = getWallet(state)

  return {
    wallet
  }
}

export default connect(mapState)(ItemSaleActions)
