import { createSelector } from 'reselect'
import { Item, NFTCategory, Order, RentalListing, RentalStatus } from '@dcl/schemas'
import { Transaction, TransactionStatus } from 'decentraland-dapps/dist/modules/transaction/types'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { Asset, AssetType } from '../../asset/types'
import { getFavoritedItems as getFavoritedItemsFromState, getListId, getLists } from '../../favorites/selectors'
import { FavoritesData, List } from '../../favorites/types'
import { ItemState } from '../../item/reducer'
import { getData as getItemData } from '../../item/selectors'
import { NFTState } from '../../nft/reducer'
import { getData as getNFTData, getWalletNFTs } from '../../nft/selectors'
import { NFT } from '../../nft/types'
import { getData as getOrderData } from '../../order/selectors'
import { RootState } from '../../reducer'
import { CLAIM_ASSET_TRANSACTION_SUBMITTED } from '../../rental/actions'
import { getData as getRentalData } from '../../rental/selectors'
import { getTransactionsByType } from '../../transaction/selectors'
import { VendorName } from '../../vendor'
import { Section, Sections } from '../../vendor/routing/types'
import { getAddress, getWallet } from '../../wallet/selectors'
import { View } from '../types'
import { BrowseUIState } from './reducer'
import { OnRentNFT, OnSaleElement, OnSaleNFT } from './types'
import { byFavoriteCreatedAtAsc } from './utils'

export const getState = (state: RootState) => state.ui.browse
export const getView = (state: RootState): View | undefined => getState(state).view
export const getCount = (state: RootState) => getState(state).count
export const getPage = (state: RootState) => getState(state).page

const getNFTs = createSelector<RootState, BrowseUIState, NFTState['data'], NFT[]>(getState, getNFTData, (browse, nftsById) =>
  browse.nftIds.map(id => nftsById[id])
)

const getItems = createSelector<RootState, BrowseUIState, ItemState['data'], Item[]>(getState, getItemData, (browse, itemsById) =>
  browse.itemIds.map(id => itemsById[id])
)

export const getOnSaleItems = createSelector<RootState, ReturnType<typeof getAddress>, ReturnType<typeof getItemData>, Item[]>(
  getAddress,
  getItemData,
  (address, itemsById) => Object.values(itemsById).filter(item => item.isOnSale && item.creator === address)
)

export const getBrowseAssets = (state: RootState, section: Section, assetType: AssetType): Asset[] => {
  if (assetType === AssetType.ITEM) {
    return section === Sections.decentraland.LISTS ? getItemsPickedByUserOrCreator(state) : getItems(state)
  } else {
    return getNFTs(state)
  }
}

export const getBrowseLists = createSelector<RootState, BrowseUIState, Record<string, List>, List[]>(
  getState,
  getLists,
  (browse, listsById) => browse.listIds.map(id => listsById[id]).filter(Boolean)
)

const getCurrentList = createSelector<RootState, string | null, Record<string, List>, List | null>(
  getListId,
  getLists,
  (listId, listsById) => (listId ? listsById[listId] : null)
)

export const getItemsPickedByUserOrCreator = createSelector<
  RootState,
  Record<string, FavoritesData>,
  Item[],
  List | null,
  Wallet | null,
  Item[]
>(getFavoritedItemsFromState, getItems, getCurrentList, getWallet, (favoritedItems, items, list, wallet) => {
  const filteredItems =
    wallet && list && wallet.address === list.userAddress ? items.filter(item => favoritedItems[item.id]?.pickedByUser) : items
  return filteredItems.sort(byFavoriteCreatedAtAsc(favoritedItems))
})

export const getOnSaleNFTs = createSelector<
  RootState,
  ReturnType<typeof getAddress>,
  ReturnType<typeof getNFTData>,
  ReturnType<typeof getOrderData>,
  OnSaleNFT[]
>(getAddress, getNFTData, getOrderData, (address, nftsById, ordersById) =>
  Object.values(nftsById)
    .reduce(
      (acc, nft) => {
        const { activeOrderId } = nft
        const order = activeOrderId ? ordersById[activeOrderId] : undefined
        if (order) {
          acc.push([nft, order])
        }
        return acc
      },
      [] as [NFT<VendorName.DECENTRALAND>, Order][]
    )
    .filter(([nft]) => nft.owner === address)
)

const getOnRentNFTs = createSelector<RootState, ReturnType<typeof getNFTData>, ReturnType<typeof getRentalData>, OnRentNFT[]>(
  getNFTData,
  getRentalData,
  (nftsById, rentalsById) =>
    Object.values(nftsById).reduce(
      (acc, nft) => {
        const { openRentalId } = nft
        const rental = openRentalId ? rentalsById[openRentalId] : undefined
        if (rental && [RentalStatus.EXECUTED, RentalStatus.OPEN].includes(rental.status)) {
          acc.push([nft, rental])
        }
        return acc
      },
      [] as [NFT<VendorName.DECENTRALAND>, RentalListing][]
    )
)

export const getOnRentNFTsByLessor = (state: RootState, address: string) => {
  return getOnRentNFTs(state).filter(([, rental]) => rental.lessor === address)
}

export const getOnRentNFTsByTenant = (state: RootState, address: string) => {
  return getOnRentNFTs(state).filter(([, rental]) => rental.tenant === address)
}

export const getWalletOwnedLands = createSelector(getWallet, getWalletNFTs, getOnRentNFTs, (wallet, nfts, onRentNFTs) => {
  return [
    ...nfts.filter(nft => [NFTCategory.ESTATE, NFTCategory.PARCEL].includes(nft.category as NFTCategory)),
    ...onRentNFTs.filter(([, rental]) => rental.lessor === wallet?.address).map(([nft]) => nft)
  ]
})

export const getOnSaleElements = createSelector<
  RootState,
  ReturnType<typeof getOnSaleItems>,
  ReturnType<typeof getOnSaleNFTs>,
  OnSaleElement[]
>(getOnSaleItems, getOnSaleNFTs, (items, nfts) => [...items, ...nfts])

export const getLastTransactionForClaimingBackLand = (state: RootState, nft: NFT): Transaction | null => {
  const userAddress = getAddress(state)

  if (!userAddress) return null

  const transactionsClaimedLand = getTransactionsByType(state, userAddress, CLAIM_ASSET_TRANSACTION_SUBMITTED) as (Omit<
    Transaction,
    'payload'
  > & {
    payload: { tokenId: string; contractAddress: string }
  })[]

  const transactions = transactionsClaimedLand
    .filter(
      transaction =>
        transaction.chainId === nft.chainId &&
        transaction.payload.tokenId === nft.tokenId &&
        transaction.payload.contractAddress === nft.contractAddress
    )
    .sort((a, b) => {
      if (a.timestamp > b.timestamp) return -1
      else if (a.timestamp < b.timestamp) return 1
      return 0
    })

  return transactions[0] ?? null
}

export const isClaimingBackLandTransactionPending = (state: RootState, nft: NFT): boolean => {
  const transaction = getLastTransactionForClaimingBackLand(state, nft)

  return transaction ? transaction.status === TransactionStatus.QUEUED || transaction.status === TransactionStatus.PENDING : false
}
