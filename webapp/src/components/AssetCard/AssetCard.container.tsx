import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { RentalListing } from '@dcl/schemas'
import { getAssetPrice, isNFT } from '../../modules/asset/utils'
import { getIsSocialEmotesEnabled } from '../../modules/features/selectors'
import { getData } from '../../modules/order/selectors'
import { getActiveOrder } from '../../modules/order/utils'
import { RootState } from '../../modules/reducer'
import { getRentalById } from '../../modules/rental/selectors'
import { getOpenRentalId } from '../../modules/rental/utils'
import { useGetBrowseOptions, useGetPageName } from '../../modules/routing/hooks'
import { PageName } from '../../modules/routing/types'
import { isClaimingBackLandTransactionPending } from '../../modules/ui/browse/selectors'
import AssetCard from './AssetCard'
import { ContainerProps } from './AssetCard.types'

const AssetCardContainer: React.FC<ContainerProps> = ({ asset, order, isManager, onClick }) => {
  const { minPrice, maxPrice, sortBy } = useGetBrowseOptions()
  const pageName = useGetPageName()
  const orders = useSelector(getData)
  const isSocialEmotesEnabled = useSelector((state: RootState) => getIsSocialEmotesEnabled(state))

  // The trade behind the price, when there is one: its received asset type is the only thing that says
  // whether `price` is MANA wei or USD wei (see modules/trade/denomination). Item prices come straight
  // off the asset; NFT prices come off the active order, so the order has to be kept, not just its
  // price. Catalog rows deliberately get `undefined` — see the note in AssetCard.
  const { price, priceTradeId } = useMemo(() => {
    if (order) return { price: null, priceTradeId: undefined }
    const activeOrder = getActiveOrder(asset, orders) || undefined
    return {
      price: getAssetPrice(asset, activeOrder),
      priceTradeId: 'price' in asset ? ('tradeId' in asset ? asset.tradeId : undefined) : activeOrder?.tradeId
    }
  }, [asset, order, orders])

  const openRentalId = useMemo(() => getOpenRentalId(asset), [asset])
  const rental: RentalListing | null = useSelector((state: RootState) => (openRentalId ? getRentalById(state, openRentalId) : null))
  const isClaimingBackLandTransactionPendingValue = useSelector((state: RootState) =>
    isNFT(asset) ? isClaimingBackLandTransactionPending(state, asset) : false
  )

  const showRentalChip = useMemo(() => rental !== null && pageName === PageName.ACCOUNT, [rental, pageName])
  const appliedFilters = useMemo(
    () => ({
      minPrice,
      maxPrice
    }),
    [minPrice, maxPrice]
  )

  return (
    <AssetCard
      asset={asset}
      order={order}
      isManager={isManager}
      onClick={onClick}
      price={price}
      priceTradeId={priceTradeId}
      isClaimingBackLandTransactionPending={isClaimingBackLandTransactionPendingValue}
      rental={rental}
      showRentalChip={showRentalChip}
      sortBy={sortBy}
      pageName={pageName}
      appliedFilters={appliedFilters}
      isSocialEmotesEnabled={isSocialEmotesEnabled}
    />
  )
}

export default AssetCardContainer
