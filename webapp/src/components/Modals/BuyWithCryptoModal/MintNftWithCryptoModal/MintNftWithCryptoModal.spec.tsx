import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ChainId, Item, Network } from '@dcl/schemas'
import { AuthorizationType } from 'decentraland-dapps/dist/modules/authorization'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { CheckoutPrice, useCheckoutPriceInMana } from '../../../../modules/trade/hooks'
import { MintNftWithCryptoModal } from './MintNftWithCryptoModal'
import { Props } from './MintNftWithCryptoModal.types'

jest.mock('../../../../modules/trade/hooks')

// The HOC only supplies `onAuthorizedAction`, which the spec passes itself to read what the modal asks to
// approve. Identity keeps the component under test unwrapped.
jest.mock('decentraland-dapps/dist/containers', () => ({
  withAuthorizedAction: (Component: React.ComponentType) => Component
}))

jest.mock('decentraland-transactions', () => ({
  ...jest.requireActual<typeof import('decentraland-transactions')>('decentraland-transactions'),
  getContract: () => ({ address: '0xmarketplace', name: 'OffChainMarketplaceV2' }),
  getContractName: () => 'OffChainMarketplaceV2'
}))

// The shared confirmation modal is where the figures land, so it is replaced by a probe that reports the
// props that decide what is shown and what is approved.
jest.mock('../BuyWithCryptoModal.container', () => ({
  __esModule: true,
  default: (props: { price: string; isPriceApproximate?: boolean; onBuyNatively: () => void; onBuyWithCard?: () => void }) => (
    <div data-testid="confirmation">
      <span data-testid="price">{props.price}</span>
      <span data-testid="approximate">{String(!!props.isPriceApproximate)}</span>
      <span data-testid="card-offered">{String(!!props.onBuyWithCard)}</span>
      <button onClick={props.onBuyNatively}>buy</button>
    </div>
  )
}))

const mockedUseCheckoutPriceInMana = useCheckoutPriceInMana as jest.MockedFunction<typeof useCheckoutPriceInMana>

function renderModal(overrides: Partial<Props> = {}) {
  const item = {
    price: '2529100000000000000000',
    network: Network.MATIC,
    chainId: ChainId.MATIC_MAINNET,
    tradeId: 'a-trade',
    tradeContractAddress: '0xmarketplace'
  } as Item

  const props = {
    name: 'MintNftWithCryptoModal',
    metadata: { item, useCredits: false },
    credits: null,
    connectedChainId: ChainId.MATIC_MAINNET,
    isBuyingItemNatively: false,
    isBuyingItemCrossChain: false,
    getContract: () => ({ address: '0xmana', name: 'MANAToken' }) as never,
    onBuyItem: jest.fn(),
    onBuyItemCrossChain: jest.fn(),
    onBuyWithCard: jest.fn(),
    onAuthorizedAction: jest.fn(),
    onClose: jest.fn(),
    ...overrides
  } as unknown as Props

  return render(<MintNftWithCryptoModal {...props} />)
}

describe('when minting an item whose listing is priced in USD', () => {
  // 2,529.1 USD at 0.076148 USD/MANA.
  const convertedMana = '33212953721699847665073'
  const rawUsdAmount = '2529100000000000000000'

  describe('and the MANA to charge has been resolved', () => {
    beforeEach(() => {
      mockedUseCheckoutPriceInMana.mockReturnValue({ status: 'ready', manaWei: convertedMana, isUSDPegged: true } as CheckoutPrice)
    })

    afterEach(() => {
      jest.resetAllMocks()
    })

    it('should show the converted MANA rather than the listed amount', () => {
      renderModal()

      expect(screen.getByTestId('price')).toHaveTextContent(convertedMana)
      expect(screen.getByTestId('price')).not.toHaveTextContent(rawUsdAmount)
    })

    it('should mark the figure as approximate, since the contract reconverts at accept time', () => {
      renderModal()

      expect(screen.getByTestId('approximate')).toHaveTextContent('true')
    })

    it('should withhold the card option, which buys a fixed amount of MANA up front', () => {
      renderModal()

      expect(screen.getByTestId('card-offered')).toHaveTextContent('false')
    })

    it('should ask to approve the converted MANA', async () => {
      const onAuthorizedAction = jest.fn()
      renderModal({ onAuthorizedAction })

      await userEvent.click(screen.getByRole('button', { name: 'buy' }))

      expect(onAuthorizedAction).toHaveBeenCalledWith(
        expect.objectContaining({ authorizationType: AuthorizationType.ALLOWANCE, requiredAllowanceInWei: convertedMana })
      )
    })
  })

  describe('and the MANA to charge cannot be resolved', () => {
    beforeEach(() => {
      mockedUseCheckoutPriceInMana.mockReturnValue({ status: 'unavailable', manaWei: null, isUSDPegged: true } as CheckoutPrice)
    })

    afterEach(() => {
      jest.resetAllMocks()
    })

    it('should not render a confirmation screen', () => {
      renderModal()

      expect(screen.queryByTestId('confirmation')).not.toBeInTheDocument()
    })

    it('should say the price is unavailable instead of showing a figure', () => {
      renderModal()

      expect(screen.getByText(t('checkout_price_unavailable_modal.title'))).toBeInTheDocument()
    })
  })
})
