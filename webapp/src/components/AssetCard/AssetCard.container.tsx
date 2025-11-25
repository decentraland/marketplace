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

  const price = useMemo(() => {
    if (order) return null
    return getAssetPrice(asset, getActiveOrder(asset, orders) || undefined)
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
