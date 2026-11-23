import React from 'react'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ChainId, NFTCategory, Network } from '@dcl/schemas'
import { CreditsResponse } from 'decentraland-dapps/dist/modules/credits/types'
import { ContractName, getContract } from 'decentraland-transactions'
import { Asset, AssetType } from '../../../../modules/asset/types'
import { renderWithProviders } from '../../../../utils/test'
import BuyNFTButtons from './BuyNFTButtons'
import { Props } from './BuyNFTButtons.types'

const ITEM_PRICE = '100000000000000000000'

const ITEM = {
  id: 'an-item',
  itemId: '0',
  contractAddress: '0xcollection',
  category: NFTCategory.WEARABLE,
  network: Network.MATIC,
  chainId: ChainId.MATIC_MAINNET,
  price: ITEM_PRICE,
  available: 1,
  data: {},
  isOnSale: true
} as unknown as Asset

// What the mocked provider hands the render callback. Mutable so a test can list the same item on a
// different marketplace version; reset before each one.
let mockProvidedAsset: Asset = ITEM

// Supplies the loaded asset the real provider would resolve, so the render callback under test runs
// without the store and network machinery behind it.
jest.mock('../../../AssetProvider', () => ({
  AssetProvider: ({ children }: { children: (asset: Asset, order: null) => React.ReactNode }) => children(mockProvidedAsset, null)
}))

afterEach(() => {
  mockProvidedAsset = ITEM
})

jest.mock('./BuyWithCryptoButton', () => ({ BuyWithCryptoButton: () => <button>buy</button> }))
jest.mock('./BuyWithCardButton', () => ({ BuyWithCardButton: () => <button>card</button> }))

function renderButtons(url: string, overrides: Partial<Props> = {}) {
  const onBuyWithCrypto = jest.fn()
  const onUseCredits = jest.fn()
  const props = {
    asset: ITEM,
    assetType: AssetType.ITEM,
    isBuyingWithCryptoModalOpen: false,
    wallet: { address: '0xbuyer', networks: { [Network.MATIC]: { mana: 1000 }, [Network.ETHEREUM]: { mana: 0 } } },
    credits: null,
    isConnecting: false,
    onBuyWithCrypto,
    onExecuteOrderWithCard: jest.fn(),
    onBuyItemWithCard: jest.fn(),
    onUseCredits,
    ...overrides
  } as unknown as Props

  const rendered = renderWithProviders(<BuyNFTButtons {...props} />, { initialEntries: [url] })
  // Re-renders the same component, which is what a dispatch sitting in the render body reacted to.
  const rerender = () => rendered.rerender(<BuyNFTButtons {...props} />)
  return { onBuyWithCrypto, onUseCredits, rerender }
}

// A `buyWithCrypto=true` deep link opens the checkout on arrival. The call used to sit in the render
// body and reach the dispatch prop directly, which re-dispatched on every render and dropped the
// credits selection — the two things these tests pin.
describe('when a deep link asks for the checkout to be opened', () => {
  it('should open it once, not once per render', async () => {
    const { onBuyWithCrypto, rerender } = renderButtons('/?buyWithCrypto=true')

    await waitFor(() => expect(onBuyWithCrypto).toHaveBeenCalled())
    rerender()
    rerender()

    expect(onBuyWithCrypto).toHaveBeenCalledTimes(1)
  })

  it('should carry the credits selection that mobile-iap mode turns on', async () => {
    const { onBuyWithCrypto } = renderButtons('/?buyWithCrypto=true&view=mobile-iap')

    await waitFor(() => expect(onBuyWithCrypto).toHaveBeenCalled())
    expect(onBuyWithCrypto).toHaveBeenCalledWith(ITEM, null, true)
  })

  it('should carry the credits selection as off outside mobile-iap mode', async () => {
    const { onBuyWithCrypto } = renderButtons('/?buyWithCrypto=true')

    await waitFor(() => expect(onBuyWithCrypto).toHaveBeenCalled())
    expect(onBuyWithCrypto).toHaveBeenCalledWith(ITEM, null, false)
  })
})

describe('when no deep link asks for it', () => {
  it('should not open the checkout on its own', async () => {
    const { onBuyWithCrypto } = renderButtons('/')

    await waitFor(() => expect(screen.getByText('buy')).toBeInTheDocument())
    expect(onBuyWithCrypto).not.toHaveBeenCalled()
  })
})

describe('when the listing settles on a marketplace version Transak has no registration for', () => {
  beforeEach(async () => {
    mockProvidedAsset = {
      ...ITEM,
      tradeId: 'a-trade',
      tradeContractAddress: getContract(ContractName.OffChainMarketplaceV3, ChainId.MATIC_MAINNET).address
    } as unknown as Asset
    renderButtons('/')
    await screen.findByText('buy')
  })

  it('should not offer the card, since the widget could not execute the purchase', () => {
    expect(screen.queryByText('card')).not.toBeInTheDocument()
  })
})

describe('when the listing settles on a marketplace version Transak knows', () => {
  let card: HTMLElement

  beforeEach(async () => {
    mockProvidedAsset = {
      ...ITEM,
      tradeId: 'a-trade',
      tradeContractAddress: getContract(ContractName.OffChainMarketplaceV2, ChainId.MATIC_MAINNET).address
    } as unknown as Asset
    renderButtons('/')
    card = await screen.findByText('card')
  })

  it('should offer the card', () => {
    expect(card).toBeInTheDocument()
  })
})

// The mobile in-app view is the one place the buy box still spends credits: it always pays with them,
// so the single checkout button is gated on the balance rather than offered as a choice.
describe('when the page is opened in the mobile in-app view', () => {
  let onBuyWithCrypto: jest.Mock
  let onUseCredits: jest.Mock
  let credits: CreditsResponse

  describe('and the credits balance covers the price', () => {
    beforeEach(async () => {
      credits = { totalCredits: ITEM_PRICE } as unknown as CreditsResponse
      ;({ onBuyWithCrypto, onUseCredits } = renderButtons('/?view=mobile-iap', { credits }))
      await screen.findByRole('button')
    })

    it('should switch the purchase to credits', () => {
      expect(onUseCredits).toHaveBeenCalledWith(true)
    })

    it('should let the buyer check out', () => {
      expect(screen.getByRole('button')).toBeEnabled()
    })

    describe('and the buyer checks out', () => {
      beforeEach(async () => {
        await userEvent.click(screen.getByRole('button'))
      })

      it('should pay the purchase with credits', () => {
        expect(onBuyWithCrypto).toHaveBeenCalledWith(ITEM, null, true)
      })
    })
  })

  describe('and the credits balance falls short of the price', () => {
    beforeEach(async () => {
      credits = { totalCredits: '1' } as unknown as CreditsResponse
      renderButtons('/?view=mobile-iap', { credits })
      await screen.findByRole('button')
    })

    it('should not let the buyer check out', () => {
      expect(screen.getByRole('button')).toBeDisabled()
    })
  })
})
