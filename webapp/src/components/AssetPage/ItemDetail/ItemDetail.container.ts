import { connect } from 'react-redux'
import { getIsBuyNftsWithFiatEnabled } from '../../../modules/features/selectors'
import { RootState } from '../../../modules/reducer'
import { getWallet } from '../../../modules/wallet/selectors'
import ItemDetail from './ItemDetail'
import { MapStateProps } from './ItemDetail.types'

const mapState = (state: RootState): MapStateProps => ({
  wallet: getWallet(state),
  isBuyNftsWithFiatEnabled: getIsBuyNftsWithFiatEnabled(state)
})

const mapDispatch = () => ({})

export default connect(mapState, mapDispatch)(ItemDetail)
