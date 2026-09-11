import React from 'react'
import { screen, waitFor } from '@testing-library/react'
import { ChainId, NFTCategory, Network } from '@dcl/schemas'
import { Asset, AssetType } from '../../../../modules/asset/types'
import { renderWithProviders } from '../../../../utils/test'
import BuyNFTButtons from './BuyNFTButtons'
import { Props } from './BuyNFTButtons.types'

const ITEM = {
  id: 'an-item',
  itemId: '0',
  contractAddress: '0xcollection',
  category: NFTCategory.WEARABLE,
  network: Network.MATIC,
  chainId: ChainId.MATIC_MAINNET,
  price: '100000000000000000000',
  available: 1,
  data: {},
  isOnSale: true
} as unknown as Asset

// Supplies the loaded asset the real provider would resolve, so the render callback under test runs
// without the store and network machinery behind it.
jest.mock('../../../AssetProvider', () => ({
  AssetProvider: ({ children }: { children: (asset: Asset, order: null) => React.ReactNode }) => children(ITEM, null)
}))

jest.mock('../UseCreditsToggle', () => ({ __esModule: true, default: () => null }))
jest.mock('./BuyWithCryptoButton', () => ({ BuyWithCryptoButton: () => <button>buy</button> }))
jest.mock('./BuyWithCardButton', () => ({ BuyWithCardButton: () => <button>card</button> }))

function renderButtons(url: string, overrides: Partial<Props> = {}) {
  const onBuyWithCrypto = jest.fn()
  const props = {
    asset: ITEM,
    assetType: AssetType.ITEM,
    isBuyingWithCryptoModalOpen: false,
    wallet: { address: '0xbuyer', networks: { [Network.MATIC]: { mana: 1000 }, [Network.ETHEREUM]: { mana: 0 } } },
    credits: null,
    isConnecting: false,
    isCreditsEnabled: false,
    isCreditsSecondarySalesEnabled: false,
    onBuyWithCrypto,
    onExecuteOrderWithCard: jest.fn(),
    onBuyItemWithCard: jest.fn(),
    onUseCredits: jest.fn(),
    ...overrides
  } as unknown as Props

  const rendered = renderWithProviders(<BuyNFTButtons {...props} />, { initialEntries: [url] })
  // Re-renders the same component, which is what a dispatch sitting in the render body reacted to.
  const rerender = () => rendered.rerender(<BuyNFTButtons {...props} />)
  return { onBuyWithCrypto, rerender }
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
