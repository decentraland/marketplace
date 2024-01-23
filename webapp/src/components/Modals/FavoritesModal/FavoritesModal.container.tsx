import { connect } from 'react-redux'
import { RootState } from '../../../modules/reducer'
import { getWallet } from '../../../modules/wallet/selectors'
import { MapStateProps } from './FavoritesModal.types'
import FavoritesModal from './FavoritesModal'

const mapState = (state: RootState): MapStateProps => {
  return { wallet: getWallet(state) }
}

export default connect(mapState)(FavoritesModal)
