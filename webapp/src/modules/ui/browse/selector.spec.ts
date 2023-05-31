import {
  ChainId,
  Item,
  NFTCategory,
  Order,
  RentalListing,
  RentalStatus
} from '@dcl/schemas'
import {
  Transaction,
  TransactionStatus
} from 'decentraland-dapps/dist/modules/transaction/types'
import { NFT } from '../../nft/types'
import { RootState } from '../../reducer'
import { FavoritesState } from '../../favorites/reducer'
import { CLAIM_ASSET_TRANSACTION_SUBMITTED } from '../../rental/actions'
import { FavoritesData, List } from '../../favorites/types'
import { AssetType } from '../../asset/types'
import { Section } from '../../vendor/decentraland/routing'
import { View } from '../types'
import { BrowseUIState } from './reducer'
import {
  getBrowseAssets,
  getBrowseLists,
  getCount,
  getItemsPickedByUser,
  getOnRentNFTsByLessor,
  getOnRentNFTsByTenant,
  getOnSaleElements,
  getOnSaleNFTs,
  getPage,
  getState,
  getView,
  getWalletOwnedLands,
  isClaimingBackLandTransactionPending
} from './selectors'

let rootState: RootState
let item: Item
let itemOnSale: Item
let nft: NFT
let nftOnSale: NFT
let nftWithOpenRent: NFT
let nftWithCancelledRent: NFT
let nftWithExecutedRentByLessor: NFT
let nftWithExecutedRentByTenant: NFT
let nftWithLandCategory: NFT
let nftWithWearableCategory: NFT
let address: string
let order: Order
let rental: RentalListing
let rentalCancelled: RentalListing
let rentalExecutedByLessor: RentalListing
let rentalExecutedByTenant: RentalListing
let list: List

beforeEach(() => {
  address = '0xaddress'
  item = { id: '123', isOnSale: false, creator: address } as Item
  itemOnSale = { id: '234', isOnSale: true, creator: address } as Item
  nft = { id: '456', owner: address } as NFT
  order = { id: 'orderId ' } as Order
  nftOnSale = { id: '567', activeOrderId: order.id, owner: address } as NFT
  list = {
    id: 'listId',
    name: 'listName',
    description: 'listDescription',
    userAddress: address,
    createdAt: 123
  }
  rental = {
    id: 'rentalId',
    status: RentalStatus.OPEN,
    lessor: address
  } as RentalListing
  rentalCancelled = {
    id: 'aCancelledRentalId',
    status: RentalStatus.CANCELLED,
    lessor: address
  } as RentalListing
  rentalExecutedByLessor = {
    id: 'anExecutedRentalId',
    status: RentalStatus.EXECUTED,
    lessor: address
  } as RentalListing
  rentalExecutedByTenant = {
    id: 'anotherExecutedRentalId',
    status: RentalStatus.EXECUTED,
    tenant: address,
    lessor: '0x1'
  } as RentalListing
  nftWithOpenRent = {
    id: '678',
    openRentalId: rental.id,
    owner: address
  } as NFT
  nftWithCancelledRent = {
    id: '789',
    openRentalId: rentalCancelled.id,
    owner: address
  } as NFT
  nftWithExecutedRentByLessor = {
    id: '891',
    openRentalId: rentalExecutedByLessor.id,
    owner: address
  } as NFT
  nftWithExecutedRentByTenant = {
    id: '892',
    openRentalId: rentalExecutedByTenant.id,
    owner: address
  } as NFT
  nftWithLandCategory = {
    id: '893',
    owner: address,
    category: NFTCategory.PARCEL
  } as NFT
  nftWithWearableCategory = {
    id: '894',
    owner: address,
    category: NFTCategory.WEARABLE
  } as NFT
  rootState = {
    ui: {
      browse: {
        itemIds: [item.id, itemOnSale.id],
        lastTimestamp: 123,
        nftIds: [
          nft.id,
          nftOnSale.id,
          nftWithOpenRent.id,
          nftWithCancelledRent.id,
          nftWithExecutedRentByLessor.id,
          nftWithExecutedRentByTenant.id
        ],
        listIds: [list.id],
        count: 1,
        page: 1,
        view: View.MARKET
      } as BrowseUIState
    },
    nft: {
      data: {
        [nft.id]: nft,
        [nftOnSale.id]: nftOnSale,
        [nftWithOpenRent.id]: nftWithOpenRent,
        [nftWithCancelledRent.id]: nftWithCancelledRent,
        [nftWithExecutedRentByLessor.id]: nftWithExecutedRentByLessor,
        [nftWithExecutedRentByTenant.id]: nftWithExecutedRentByTenant,
        [nftWithLandCategory.id]: nftWithLandCategory,
        [nftWithWearableCategory.id]: nftWithWearableCategory
      }
    },
    item: {
      data: { [item.id]: item, [itemOnSale.id]: itemOnSale }
    },
    order: {
      data: {
        [order.id]: order
      }
    },
    rental: {
      data: {
        [rental.id]: rental,
        [rentalCancelled.id]: rentalCancelled,
        [rentalExecutedByLessor.id]: rentalExecutedByLessor,
        [rentalExecutedByTenant.id]: rentalExecutedByTenant
      }
    },
    wallet: {
      data: {
        address
      }
    },
    favorites: {
      data: { items: {}, lists: { [list.id]: list }, total: 0 },
      loading: [],
      error: null
    } as FavoritesState
  } as RootState
})

describe('when getting the ui browse state from the root state', () => {
  it('should retrieve the ui browse state', () => {
    expect(getState(rootState)).toBe(rootState.ui.browse)
  })
})

describe('when getting the view of the ui browse state', () => {
  it('should retrieve the view of the ui browse state', () => {
    expect(getView(rootState)).toBe(rootState.ui.browse.view)
  })
})

describe('when getting the count of the ui browse state', () => {
  it('should retrieve the count of the ui browse state', () => {
    expect(getCount(rootState)).toBe(rootState.ui.browse.count)
  })
})

describe('when getting the page of the ui browse state', () => {
  it('should retrieve the count of the ui browse state', () => {
    expect(getPage(rootState)).toBe(rootState.ui.browse.page)
  })
})

describe('when getting the NFTs On Sale of the ui browse state', () => {
  it('should retrieve the NFTs on sale of the ui browse state', () => {
    expect(getOnSaleNFTs(rootState)).toStrictEqual([[nftOnSale, order]])
  })
})

describe('when getting the NFTs on rent by lessor', () => {
  it('should get all the NFTs put on rent by the given lessor', () => {
    expect(getOnRentNFTsByLessor(rootState, address)).toEqual([
      [nftWithOpenRent, rental],
      [nftWithExecutedRentByLessor, rentalExecutedByLessor]
    ])
  })
})

describe('when getting the NFTs on rent by tenant', () => {
  it('should get all the NFTs rented by the given tenant', () => {
    expect(getOnRentNFTsByTenant(rootState, address)).toEqual([
      [nftWithExecutedRentByTenant, rentalExecutedByTenant]
    ])
  })
})

describe('when getting all owned land', () => {
  it('should return all owned lands', () => {
    expect(getWalletOwnedLands(rootState)).toEqual([
      nftWithLandCategory,
      nftWithOpenRent,
      nftWithExecutedRentByLessor
    ])
  })
})

describe('when getting the Elements on sale of the ui browse state', () => {
  it('should retrieve the NFTs on sale of the ui browse state', () => {
    expect(getOnSaleElements(rootState)).toStrictEqual([
      itemOnSale,
      [nftOnSale, order]
    ])
  })
})

describe('when getting if the claiming back transaction is pending', () => {
  const myAddress = '0xaddress'
  const chainId = ChainId.ETHEREUM_GOERLI
  const tokenId = '1'
  const contractAddress = '0xnewAddress'

  let nft: NFT
  let state: RootState

  beforeEach(() => {
    nft = { id: '567', tokenId, contractAddress, chainId } as NFT

    state = ({
      wallet: {
        data: {
          address: null
        }
      },
      transaction: {
        data: [] as Transaction[]
      }
    } as unknown) as RootState
  })

  describe('and there is no address', () => {
    beforeEach(() => {
      state.wallet.data!.address = ''
    })

    it('should return false', () => {
      expect(isClaimingBackLandTransactionPending(state, nft)).toBeFalsy()
    })
  })

  describe('and there are no transactions', () => {
    beforeEach(() => {
      state.wallet.data!.address = myAddress
      state.transaction.data = []
    })

    it('should return false ', () => {
      expect(isClaimingBackLandTransactionPending(state, nft)).toBeFalsy()
    })
  })
  ;[
    {
      status: TransactionStatus.CONFIRMED,
      expectedResult: false
    },
    {
      status: TransactionStatus.DROPPED,
      expectedResult: false
    },
    {
      status: TransactionStatus.PENDING,
      expectedResult: true
    },
    {
      status: TransactionStatus.QUEUED,
      expectedResult: true
    },
    {
      status: TransactionStatus.REPLACED,
      expectedResult: false
    },
    {
      status: TransactionStatus.REVERTED,
      expectedResult: false
    }
  ].forEach(element => {
    describe(`and there is one transaction with status: ${element.status}`, () => {
      beforeEach(() => {
        state.wallet.data!.address = myAddress
        state.transaction.data = [
          {
            hash: 'hash',
            timestamp: 123456,
            from: myAddress,
            actionType: CLAIM_ASSET_TRANSACTION_SUBMITTED,
            status: element.status,
            chainId,
            payload: {
              tokenId,
              contractAddress
            }
          }
        ] as Transaction[]
      })

      it(`should return ${element.expectedResult}`, () => {
        expect(isClaimingBackLandTransactionPending(state, nft)).toBe(
          element.expectedResult
        )
      })
    })
  })

  describe('and there are two transactions: one pending and one confirmed', () => {
    beforeEach(() => {
      state.wallet.data!.address = myAddress
      state.transaction.data = [
        {
          hash: 'hash',
          timestamp: 123456,
          from: myAddress,
          actionType: CLAIM_ASSET_TRANSACTION_SUBMITTED,
          status: TransactionStatus.CONFIRMED,
          chainId,
          payload: {
            tokenId,
            contractAddress
          }
        },
        {
          hash: 'hashPending',
          timestamp: 1234567,
          from: myAddress,
          actionType: CLAIM_ASSET_TRANSACTION_SUBMITTED,
          status: TransactionStatus.PENDING,
          chainId,
          payload: {
            tokenId,
            contractAddress
          }
        }
      ] as Transaction[]
    })

    it('should return true', () => {
      expect(isClaimingBackLandTransactionPending(state, nft)).toBeTruthy()
    })
  })
})

describe('when getting the user favorited items of the ui browse state', () => {
  let favoritedItems: Record<string, FavoritesData>
  beforeEach(() => {
    favoritedItems = {
      [item.id]: { pickedByUser: true, count: 1 },
      [itemOnSale.id]: { pickedByUser: false, count: 4 }
    }
  })

  it('should retrieve the items that were favorited by the user', () => {
    expect(
      getItemsPickedByUser.resultFunc(favoritedItems, [item, itemOnSale])
    ).toEqual([item])
  })
})

describe('when getting the browse assets', () => {
  let section: Section
  let assetType: AssetType

  describe('when the requested asset type is item', () => {
    beforeEach(() => {
      assetType = AssetType.ITEM
    })

    describe('and the section is My Lists', () => {
      beforeEach(() => {
        section = Section.LISTS
        rootState.favorites.data.items = {
          [item.id]: { pickedByUser: true, count: 1 },
          [itemOnSale.id]: { pickedByUser: false, count: 4 }
        }
      })

      it('should return all browsable items picked by the user', () => {
        expect(getBrowseAssets(rootState, section, assetType)).toStrictEqual([
          item
        ])
      })
    })

    describe('and the section not My Lists', () => {
      beforeEach(() => {
        section = Section.ENS
      })

      it('should return all the browsable items', () => {
        expect(getBrowseAssets(rootState, section, assetType)).toStrictEqual([
          item,
          itemOnSale
        ])
      })
    })
  })

  describe('when the requested asset type is nft', () => {
    beforeEach(() => {
      assetType = AssetType.NFT
    })

    it('should return all the browsable nfts', () => {
      expect(getBrowseAssets(rootState, section, assetType)).toStrictEqual([
        nft,
        nftOnSale,
        nftWithOpenRent,
        nftWithCancelledRent,
        nftWithExecutedRentByLessor,
        nftWithExecutedRentByTenant
      ])
    })
  })
})

describe('when getting the browse lists', () => {
  it('should retrieve the lists of the ui browse state', () => {
    expect(getBrowseLists(rootState)).toStrictEqual([list])
  })
})
