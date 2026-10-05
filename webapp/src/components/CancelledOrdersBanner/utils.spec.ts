import { ChainId, Network } from '@dcl/schemas'
import { getBuilderCollectionDetailUrl } from '../../modules/collection/utils'
import { locations } from '../../modules/routing/locations'
import { CancellationReason, CancelledTrade, CancelledTradeType } from '../../modules/vendor/decentraland/cancelledTrades/types'
import { dismissCancelledOrdersBanner, getRecreateLink, isCancelledOrdersBannerDismissed, RecreateLink } from './utils'

const CONTRACT = '0xcontract'

const buildTrade = (type: CancelledTradeType, asset: Partial<CancelledTrade['asset']>): CancelledTrade => ({
  id: 'a-trade-id',
  type,
  network: Network.MATIC,
  chainId: ChainId.MATIC_MAINNET,
  contract: '0xmarketplace',
  reason: CancellationReason.CONTRACT_SIGNATURE_INDEX_BUMP,
  createdAt: 0,
  expiresAt: 0,
  cancelledAt: 0,
  asset: { contractAddress: CONTRACT, tokenId: null, itemId: null, name: null, image: null, ...asset },
  price: null
})

describe('when getting the link to re-create a cancelled trade', () => {
  let trade: CancelledTrade
  let link: RecreateLink | null

  describe('and the trade is an NFT listing', () => {
    beforeEach(() => {
      trade = buildTrade(CancelledTradeType.PUBLIC_NFT_ORDER, { tokenId: '12' })
      link = getRecreateLink(trade)
    })

    it('should link to the sell page of the NFT', () => {
      expect(link).toEqual({ url: locations.sell(CONTRACT, '12'), isExternal: false })
    })
  })

  describe('and the trade is a bid on an NFT', () => {
    beforeEach(() => {
      trade = buildTrade(CancelledTradeType.BID, { tokenId: '12' })
      link = getRecreateLink(trade)
    })

    it('should link to the bid page of the NFT', () => {
      expect(link).toEqual({ url: locations.bid(CONTRACT, '12'), isExternal: false })
    })
  })

  describe('and the trade is a bid on an item', () => {
    beforeEach(() => {
      trade = buildTrade(CancelledTradeType.BID, { itemId: '3' })
      link = getRecreateLink(trade)
    })

    it('should link to the bid page of the item', () => {
      expect(link).toEqual({ url: locations.bidItem(CONTRACT, '3'), isExternal: false })
    })
  })

  describe('and the trade is an item listing', () => {
    beforeEach(() => {
      trade = buildTrade(CancelledTradeType.PUBLIC_ITEM_ORDER, { itemId: '3' })
      link = getRecreateLink(trade)
    })

    it('should link to the collection in the Builder as an external link', () => {
      expect(link).toEqual({ url: getBuilderCollectionDetailUrl(CONTRACT), isExternal: true })
    })
  })

  describe('and the trade is an NFT listing without a token id', () => {
    beforeEach(() => {
      trade = buildTrade(CancelledTradeType.PUBLIC_NFT_ORDER, {})
      link = getRecreateLink(trade)
    })

    it('should return no link', () => {
      expect(link).toBeNull()
    })
  })
})

describe('when checking if the banner was dismissed', () => {
  let address: string

  beforeEach(() => {
    address = '0xAbC'
  })

  afterEach(() => {
    localStorage.clear()
  })

  describe('and it was dismissed for the same wallet and count', () => {
    beforeEach(() => {
      dismissCancelledOrdersBanner(address, 3)
    })

    it('should report it as dismissed', () => {
      expect(isCancelledOrdersBannerDismissed(address.toLowerCase(), 3)).toBe(true)
    })
  })

  describe('and it was dismissed with a different count', () => {
    beforeEach(() => {
      dismissCancelledOrdersBanner(address, 2)
    })

    it('should report it as not dismissed', () => {
      expect(isCancelledOrdersBannerDismissed(address, 3)).toBe(false)
    })
  })

  describe('and the storage is not accessible', () => {
    beforeEach(() => {
      jest.spyOn(Storage.prototype, 'getItem').mockImplementationOnce(() => {
        throw new Error('blocked')
      })
    })

    afterEach(() => {
      jest.restoreAllMocks()
    })

    it('should report it as not dismissed', () => {
      expect(isCancelledOrdersBannerDismissed(address, 3)).toBe(false)
    })
  })
})
