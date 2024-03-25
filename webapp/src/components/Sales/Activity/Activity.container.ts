import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { Item, Sale, SaleType } from '@dcl/schemas'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { Asset } from '../../../modules/asset/types'
import { FETCH_ITEM_REQUEST } from '../../../modules/item/actions'
import { getData as getItemsData, getLoading as getItemLoading } from '../../../modules/item/selectors'
import { FETCH_NFT_REQUEST } from '../../../modules/nft/actions'
import { getData as getNftData, getLoading as getNftLoading } from '../../../modules/nft/selectors'
import { NFT } from '../../../modules/nft/types'
import { RootState } from '../../../modules/reducer'
import { browse } from '../../../modules/routing/actions'
import { getPageNumber } from '../../../modules/routing/selectors'
import { FETCH_SALES_REQUEST } from '../../../modules/sale/actions'
import { getSales, getCount, getLoading as getSaleLoading } from '../../../modules/sale/selectors'
import Activity from './Activity'
import { MapStateProps, MapDispatchProps } from './Activity.types'

const getAssets = (sales: Sale[], items: Record<string, Item>, nfts: Record<string, NFT>) =>
  sales.reduce(
    (acc, sale) => {
      const { contractAddress, itemId, tokenId, type } = sale

      const item = items[`${contractAddress}-${itemId}`]
      const nft = nfts[`${contractAddress}-${tokenId}`]

      if (type === SaleType.MINT && item) {
        acc[sale.id] = item
      } else if (nft) {
        acc[sale.id] = nft
      }

      return acc
    },
    {} as Record<string, Asset>
  )

const getIsLoading = (state: RootState) =>
  isLoadingType(getSaleLoading(state), FETCH_SALES_REQUEST) ||
  isLoadingType(getItemLoading(state), FETCH_ITEM_REQUEST) ||
  isLoadingType(getNftLoading(state), FETCH_NFT_REQUEST)

const mapState = (state: RootState): MapStateProps => {
  const sales = getSales(state)
  const count = getCount(state)
  const items = getItemsData(state)
  const nfts = getNftData(state)
  const page = getPageNumber(state)
  const assets = getAssets(sales, items, nfts)
  const isLoading = getIsLoading(state)

  return {
    sales,
    assets,
    count,
    page,
    isLoading
  }
}

const mapDispatch = (dispatch: Dispatch): MapDispatchProps => {
  return {
    onBrowse: options => dispatch(browse(options))
  }
}

export default connect(mapState, mapDispatch)(Activity)
