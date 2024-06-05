import { connect } from 'react-redux'
import { getContract } from '../../modules/contract/selectors'
import { getWalletNFTs } from '../../modules/nft/selectors'
import { RootState } from '../../modules/reducer'
import { getLastModifiedDate, getTiles, getTilesByEstateId } from '../../modules/tile/selectors'
import { getOnRentNFTsByLessor } from '../../modules/ui/browse/selectors'
import { Contract } from '../../modules/vendor/services'
import { getWallet } from '../../modules/wallet/selectors'
import Atlas from './Atlas'
import { MapStateProps } from './Atlas.types'

const mapState = (state: RootState): MapStateProps => {
  const wallet = getWallet(state)
  const nftsOnRent = wallet ? getOnRentNFTsByLessor(state, wallet?.address) : []

  return {
    tiles: getTiles(state),
    nfts: getWalletNFTs(state),
    nftsOnRent,
    tilesByEstateId: getTilesByEstateId(state),
    lastAtlasModifiedDate: getLastModifiedDate(state),
    getContract: (query: Partial<Contract>) => getContract(state, query)
  }
}

export default connect(mapState)(Atlas)
