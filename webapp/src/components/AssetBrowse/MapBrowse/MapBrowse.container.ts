import { connect } from 'react-redux'
import { RootState } from '../../../modules/reducer'
import { getIsMapViewFiltersEnabled } from '../../../modules/features/selectors'
import {
  getOnlyOnRent,
  getOnlyOnSale
} from '../../../modules/routing/selectors'
import { browse } from '../../../modules/routing/actions'
import { getTiles } from '../../../modules/tile/selectors'
import { MapStateProps, MapDispatch, MapDispatchProps } from './MapBrowse.types'
import { MapBrowse } from './MapBrowse'
import { getWalletNFTs } from '../../../modules/nft/selectors'
import { NFTCategory } from '@dcl/schemas'

const mapState = (state: RootState): MapStateProps => {
  return {
    tiles: getTiles(state),
    ownedLands: getWalletNFTs(state).filter(
      nft =>
        nft.category === NFTCategory.ESTATE ||
        nft.category === NFTCategory.PARCEL
    ),
    onlyOnSale: getOnlyOnSale(state),
    onlyOnRent: getOnlyOnRent(state),
    isMapViewFiltersEnabled: getIsMapViewFiltersEnabled(state)
  }
}

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onBrowse: options => dispatch(browse(options))
})

export default connect(mapState, mapDispatch)(MapBrowse)
