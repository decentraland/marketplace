import { connect } from 'react-redux'
import { MapStateProps, MapDispatchProps } from './Sales.types'
import Sales from './Sales'
import { RootState } from '../../modules/reducer'
import {
  getSales,
  getCount,
  getLoading as getSaleLoading
} from '../../modules/sale/selectors'
import {
  getData as getItemsData,
  getLoading as getItemLoading
} from '../../modules/item/selectors'
import {
  getData as getNftData,
  getLoading as getNftLoading
} from '../../modules/nft/selectors'
import { Asset } from '../../modules/asset/types'
import { getPage } from '../../modules/routing/selectors'
import { Dispatch } from 'redux'
import { browse } from '../../modules/routing/actions'
import { getAddress } from '../../modules/wallet/selectors'
import {
  getMetricsByAddress,
  getLoading as getAccountLoading
} from '../../modules/account/selectors'
import { Item, Sale } from '@dcl/schemas'
import { NFT } from '../../modules/nft/types'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { FETCH_SALES_REQUEST } from '../../modules/sale/actions'
import { FETCH_ITEM_REQUEST } from '../../modules/item/actions'
import { FETCH_NFT_REQUEST } from '../../modules/nft/actions'
import { FETCH_ACCOUNT_METRICS_REQUEST } from '../../modules/account/actions'

const getEmptyMetrics = (address: string) => ({
  address,
  earned: '0',
  spent: '0',
  royalties: '0',
  purchases: 0,
  sales: 0
})

const getAssets = (
  sales: Sale[],
  items: Record<string, Item>,
  nfts: Record<string, NFT>
) =>
  sales.reduce((acc, sale) => {
    const { contractAddress, itemId, tokenId } = sale
    const item = items[`${contractAddress}-${itemId}`]
    const nft = nfts[`${contractAddress}-${tokenId}`]

    if (itemId && item) {
      acc[sale.id] = item
    } else if (tokenId && nft) {
      acc[sale.id] = nft
    }

    return acc
  }, {} as Record<string, Asset>)

const getIsLoading = (state: RootState) =>
  isLoadingType(getSaleLoading(state), FETCH_SALES_REQUEST) ||
  isLoadingType(getItemLoading(state), FETCH_ITEM_REQUEST) ||
  isLoadingType(getNftLoading(state), FETCH_NFT_REQUEST) ||
  isLoadingType(getAccountLoading(state), FETCH_ACCOUNT_METRICS_REQUEST)

const mapState = (state: RootState): MapStateProps => {
  const address = getAddress(state)
  const emptyMetrics = getEmptyMetrics(address!)
  const sales = getSales(state)
  const count = getCount(state)
  const items = getItemsData(state)
  const nfts = getNftData(state)
  const page = getPage(state)
  const metrics = getMetricsByAddress(state)[address!] || emptyMetrics
  const assets = getAssets(sales, items, nfts)
  const isLoading = getIsLoading(state)

  return {
    sales,
    assets,
    count,
    page,
    ethereumEarned: metrics.ETHEREUM?.earned || emptyMetrics.earned,
    maticEarned: metrics.MATIC?.earned || emptyMetrics.earned,
    totalSales: metrics.aggregated?.sales || emptyMetrics.sales,
    isLoading
  }
}

const mapDispatch = (dispatch: Dispatch): MapDispatchProps => {
  return {
    onBrowse: options => dispatch(browse(options))
  }
}

export default connect(mapState, mapDispatch)(Sales)
