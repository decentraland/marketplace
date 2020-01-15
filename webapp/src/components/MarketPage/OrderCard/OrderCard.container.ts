import { connect } from 'react-redux'
import { RootState } from '../../../modules/reducer'
import { getData } from '../../../modules/nft/selectors'
import {
  MapStateProps,
  OwnProps,
  MapDispatch,
  MapDispatchProps
} from './OrderCard.types'
import OrderCard from './OrderCard'

const mapState = (state: RootState, ownProps: OwnProps): MapStateProps => {
  const nfts = getData(state)
  return {
    nft: nfts[ownProps.order.nftId]
  }
}

const mapDispatch = (_dispatch: MapDispatch): MapDispatchProps => ({})

export default connect(mapState, mapDispatch)(OrderCard)
