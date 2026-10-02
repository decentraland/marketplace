import { renderHook, waitFor } from '@testing-library/react'
import { ChainId, Network } from '@dcl/schemas'
import { getChainIdByNetwork } from 'decentraland-dapps/dist/lib/eth'
import { PriceDenomination, fetchTradePricing } from './denomination'
import { useCheckoutPriceInMana } from './hooks'
import { ManaUsdRate, fetchManaUsdRate } from './manaRate'

jest.mock('decentraland-dapps/dist/lib/eth')
jest.mock('./denomination', () => ({
  ...jest.requireActual<typeof import('./denomination')>('./denomination'),
  fetchTradePricing: jest.fn()
}))
jest.mock('./manaRate', () => ({
  ...jest.requireActual<typeof import('./manaRate')>('./manaRate'),
  fetchManaUsdRate: jest.fn()
}))

const mockedFetchTradePricing = fetchTradePricing as jest.MockedFunction<typeof fetchTradePricing>
const mockedFetchManaUsdRate = fetchManaUsdRate as jest.MockedFunction<typeof fetchManaUsdRate>
const mockedGetChainIdByNetwork = getChainIdByNetwork as jest.MockedFunction<typeof getChainIdByNetwork>

const MARKETPLACE = '0xa40b1d129b8906888720686f3a01921ddf37716f'

describe('when resolving the MANA a checkout may charge', () => {
  let price: string
  let network: Network

  beforeEach(() => {
    // A four-figure USD amount in wei, where the two denominations are far enough apart to be unmistakable.
    price = '2529100000000000000000'
    network = Network.MATIC
    mockedGetChainIdByNetwork.mockReturnValue(ChainId.MATIC_MAINNET)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('and the listing has no trade behind it', () => {
    it('should resolve the listed price without reading anything, since a listing with no trade is MANA', () => {
      const { result } = renderHook(() => useCheckoutPriceInMana(price, network, undefined))

      expect(result.current).toEqual({ status: 'ready', manaWei: price, isUSDPegged: false })
      expect(mockedFetchTradePricing).not.toHaveBeenCalled()
    })
  })

  describe('and the trade prices the listing in MANA', () => {
    beforeEach(() => {
      mockedFetchTradePricing.mockResolvedValueOnce({ denomination: PriceDenomination.MANA, marketplaceAddress: MARKETPLACE })
    })

    it('should charge the raw price', async () => {
      const { result } = renderHook(() => useCheckoutPriceInMana(price, network, 'a-trade'))

      await waitFor(() => expect(result.current).toEqual({ status: 'ready', manaWei: price, isUSDPegged: false }))
    })

    it('should not read the oracle', async () => {
      const { result } = renderHook(() => useCheckoutPriceInMana(price, network, 'a-trade'))

      await waitFor(() => expect(result.current.status).toBe('ready'))
      expect(mockedFetchManaUsdRate).not.toHaveBeenCalled()
    })
  })

  describe('and the trade prices the listing in USD', () => {
    let rate: ManaUsdRate

    beforeEach(() => {
      // 0.076148 USD per MANA at 8 decimals, the Chainlink shape.
      rate = { answer: 7614800n, decimals: 8 }
      mockedFetchTradePricing.mockResolvedValueOnce({ denomination: PriceDenomination.USD_PEGGED, marketplaceAddress: MARKETPLACE })
      mockedFetchManaUsdRate.mockResolvedValueOnce(rate)
    })

    it('should resolve the oracle conversion of the listed amount', async () => {
      const { result } = renderHook(() => useCheckoutPriceInMana(price, network, 'a-trade'))

      // 2529.1 / 0.076148 = 33,212.95… MANA.
      await waitFor(() => expect(result.current).toEqual({ status: 'ready', manaWei: '33212953721699847665073', isUSDPegged: true }))
    })

    it('should report the figure as pegged so the caller can mark it approximate', async () => {
      const { result } = renderHook(() => useCheckoutPriceInMana(price, network, 'a-trade'))

      await waitFor(() => expect(result.current.isUSDPegged).toBe(true))
    })

    describe('and the oracle cannot be read', () => {
      beforeEach(() => {
        mockedFetchManaUsdRate.mockReset()
        mockedFetchManaUsdRate.mockRejectedValueOnce(new Error('rpc down'))
      })

      it('should offer no figure rather than fall back to the listed amount', async () => {
        const { result } = renderHook(() => useCheckoutPriceInMana(price, network, 'a-trade'))

        await waitFor(() => expect(result.current.status).toBe('unavailable'))
        expect(result.current.manaWei).toBeNull()
      })
    })

    describe('and the network has no chain to read the oracle on', () => {
      beforeEach(() => {
        mockedGetChainIdByNetwork.mockImplementation(() => {
          throw new Error('config not initialised')
        })
      })

      it('should offer no figure', async () => {
        const { result } = renderHook(() => useCheckoutPriceInMana(price, network, 'a-trade'))

        await waitFor(() => expect(result.current.status).toBe('unavailable'))
      })
    })
  })

  describe('and the trade cannot be read', () => {
    beforeEach(() => {
      // What `fetchTradePricing` answers on a failed read: MANA by default, and no settlement contract.
      mockedFetchTradePricing.mockResolvedValueOnce({ denomination: PriceDenomination.MANA, marketplaceAddress: null })
    })

    it('should offer no figure rather than assume MANA', async () => {
      const { result } = renderHook(() => useCheckoutPriceInMana(price, network, 'a-trade'))

      await waitFor(() => expect(result.current).toEqual({ status: 'unavailable', manaWei: null, isUSDPegged: false }))
    })
  })

  describe('and the trade has not answered yet', () => {
    beforeEach(() => {
      mockedFetchTradePricing.mockReturnValue(new Promise(() => undefined))
    })

    it('should offer no figure while the trade is still being read', () => {
      const { result } = renderHook(() => useCheckoutPriceInMana(price, network, 'a-trade'))

      expect(result.current).toEqual({ status: 'resolving', manaWei: null, isUSDPegged: false })
    })
  })
})
