import React, { useCallback, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Item, Sale, SaleType } from '@dcl/schemas'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { Asset } from '../../../modules/asset/types'
import { FETCH_ITEM_REQUEST } from '../../../modules/item/actions'
import { getData as getItemsData, getLoading as getItemLoading } from '../../../modules/item/selectors'
import { FETCH_NFT_REQUEST } from '../../../modules/nft/actions'
import { getData as getNftData, getLoading as getNftLoading } from '../../../modules/nft/selectors'
import { NFT } from '../../../modules/nft/types'
import { browse } from '../../../modules/routing/actions'
import { useGetPaginationParamsFromCurrentUrl } from '../../../modules/routing/hooks'
import { FETCH_SALES_REQUEST } from '../../../modules/sale/actions'
import { getSales, getCount, getLoading as getSaleLoading } from '../../../modules/sale/selectors'
import Activity from './Activity'

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

const ActivityContainer: React.FC = () => {
  const dispatch = useDispatch()
  const { page } = useGetPaginationParamsFromCurrentUrl()

  const sales = useSelector(getSales)
  const count = useSelector(getCount)
  const items = useSelector(getItemsData)
  const nfts = useSelector(getNftData)

  const saleLoading = useSelector(getSaleLoading)
  const itemLoading = useSelector(getItemLoading)
  const nftLoading = useSelector(getNftLoading)

  const assets = useMemo(() => getAssets(sales, items, nfts), [sales, items, nfts])
  const isLoading = useMemo(
    () =>
      isLoadingType(saleLoading, FETCH_SALES_REQUEST) ||
      isLoadingType(itemLoading, FETCH_ITEM_REQUEST) ||
      isLoadingType(nftLoading, FETCH_NFT_REQUEST),
    [saleLoading, itemLoading, nftLoading]
  )

  const handleBrowse = useCallback<ActionFunction<typeof browse>>(options => dispatch(browse(options)), [dispatch])

  return <Activity sales={sales} assets={assets} count={count} page={page} isLoading={isLoading} onBrowse={handleBrowse} />
}

export default ActivityContainer
