import { ChainId, Item, Order, RentalListing, RentalStatus } from '@dcl/schemas'
import {
  Transaction,
  TransactionStatus
} from 'decentraland-dapps/dist/modules/transaction/types'
import { NFT } from '../../nft/types'
import { RootState } from '../../reducer'
import { CLAIM_LAND_TRANSACTION_SUBMITTED } from '../../rental/actions'
import { View } from '../types'
import { BrowseUIState } from './reducer'
import {
  getCount,
  getItems,
  getNFTs,
  getOnRentNFTs,
  getOnSaleElements,
  getOnSaleItems,
  getOnSaleNFTs,
  getState,
  getView,
  isClaimingBackLandTransactionPending
} from './selectors'

let rootState: RootState
let item: Item
let itemOnSale: Item
let nft: NFT
let nftOnSale: NFT
let nftOnRent: NFT
let address: string
let order: Order
let rental: RentalListing

beforeEach(() => {
  address = '0xaddress'
  item = { id: '123', isOnSale: false, creator: address } as Item
  itemOnSale = { id: '234', isOnSale: true, creator: address } as Item
  nft = { id: '456', owner: address } as NFT
  order = { id: 'orderId ' } as Order
  nftOnSale = { id: '567', activeOrderId: order.id, owner: address } as NFT
  rental = { id: 'rentalId', status: RentalStatus.OPEN, lessor: address } as RentalListing
  nftOnRent = { id: '678', openRentalId: rental.id } as NFT
  rootState = {
    ui: {
      browse: {
        itemIds: [item.id, itemOnSale.id],
        lastTimestamp: 123,
        nftIds: [nft.id, nftOnSale.id, nftOnRent.id],
        count: 1,
        view: View.MARKET
      } as BrowseUIState
    },
    nft: {
      data: {
        [nft.id]: nft,
        [nftOnSale.id]: nftOnSale,
        [nftOnRent.id]: nftOnRent
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
        [rental.id]: rental
      }
    },
    wallet: {
      data: {
        address
      }
    }
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

describe('when getting the NFTs of the ui browse state', () => {
  it('should retrieve the NFTs of the ui browse state', () => {
    expect(getNFTs(rootState)).toStrictEqual([nft, nftOnSale, nftOnRent])
  })
})

describe('when getting the Items of the ui browse state', () => {
  it('should retrieve the Items of the ui browse state', () => {
    expect(getItems(rootState)).toStrictEqual([item, itemOnSale])
  })
})

describe('when getting the Items On Sale of the ui browse state', () => {
  it('should retrieve the Items on sale of the ui browse state', () => {
    expect(getOnSaleItems(rootState)).toStrictEqual([itemOnSale])
  })
})

describe('when getting the NFTs On Sale of the ui browse state', () => {
  it('should retrieve the NFTs on sale of the ui browse state', () => {
    expect(getOnSaleNFTs(rootState)).toStrictEqual([[nftOnSale, order]])
  })
})

describe('when getting the NFTs on rent of the ui browse state', () => {
  it('should retrieve the NFTs on rent of the ui browse state', () => {
    expect(getOnRentNFTs(rootState)).toStrictEqual([[nftOnRent, rental]])
  })
})

describe('when getting the Elements on sale of the ui browse state', () => {
  it('should retrieve the NFTs on rent of the ui browse state', () => {
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
            actionType: CLAIM_LAND_TRANSACTION_SUBMITTED,
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
          actionType: CLAIM_LAND_TRANSACTION_SUBMITTED,
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
          actionType: CLAIM_LAND_TRANSACTION_SUBMITTED,
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
