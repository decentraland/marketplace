import { render, screen } from '@testing-library/react'
import { BigNumber, ethers } from 'ethers'
import { ChainId, Network } from '@dcl/schemas'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { Token } from 'decentraland-transactions/crossChain'
import PaymentSelector from './PaymentSelector'

jest.mock('decentraland-ui', () => ({
  Icon: ({ name }: { name: string }) => <div data-testid={`icon-${name}`}>{name}</div>,
  InfoTooltip: ({ content }: { content: string }) => <div data-testid="info-tooltip">{content}</div>
}))

jest.mock('decentraland-dapps/dist/modules/translation', () => ({
  t: (key: string) => {
    if (key === 'buy_with_crypto_modal.pay_with') return 'Pay with'
    if (key === 'buy_with_crypto_modal.balance') return 'Balance'
    if (key === 'buy_with_crypto_modal.item_cost') return 'Item Cost'
    if (key === 'buy_with_crypto_modal.fee_cost') return 'Estimated Fee'
    return key
  }
}))

jest.mock('../../../ManaToFiat', () => ({
  ManaToFiat: ({ mana, digits }: { mana: string; digits: number }) => (
    <span data-testid="mana-to-fiat">${(Number(ethers.utils.formatEther(mana)) * 0.3).toFixed(digits)}</span>
  )
}))

describe('when rendering PaymentSelector', () => {
  let price: string
  let selectedToken: Token
  let selectedChain: ChainId
  let wallet: Wallet
  let providerTokens: Token[]
  let selectedProviderChain: { networkName: string; nativeCurrency: { name: string; icon: string } }
  let onShowChainSelector: jest.Mock
  let onShowTokenSelector: jest.Mock

  beforeEach(() => {
    price = '100000000000000000000' // 100 MANA
    selectedToken = {
      symbol: 'MANA',
      address: '0xa1c57f48f0deb89f569dfbe6e2b7f46d33606fd4',
      chainId: ChainId.MATIC_MAINNET.toString(),
      decimals: 18,
      usdPrice: 0.3,
      logoURI: 'https://mana.png',
      name: 'MANA'
    } as Token
    selectedChain = ChainId.MATIC_MAINNET
    wallet = {
      address: '0x123',
      chainId: ChainId.MATIC_MAINNET,
      network: Network.MATIC,
      networks: {
        [Network.MATIC]: { mana: 1000 },
        [Network.ETHEREUM]: { mana: 500 }
      }
    } as Wallet
    providerTokens = [selectedToken]
    selectedProviderChain = {
      networkName: 'Polygon',
      nativeCurrency: {
        name: 'MATIC',
        icon: 'https://matic.png'
      }
    }
    onShowChainSelector = jest.fn()
    onShowTokenSelector = jest.fn()
  })

  describe('and credits are not being used', () => {
    beforeEach(() => {
      render(
        <PaymentSelector
          price={price}
          shouldUseCrossChainProvider={false}
          isBuyingAsset={false}
          amountInSelectedToken="100"
          route={undefined}
          routeFeeCost={undefined}
          gasCost={undefined}
          isFetchingGasCost={false}
          providerTokens={providerTokens}
          selectedToken={selectedToken}
          selectedChain={selectedChain}
          wallet={wallet}
          selectedProviderChain={selectedProviderChain}
          isFetchingBalance={false}
          selectedTokenBalance={BigNumber.from('1000000000000000000000')}
          onShowChainSelector={onShowChainSelector}
          onShowTokenSelector={onShowTokenSelector}
          useCredits={false}
        />
      )
    })

    it('should display the item cost', () => {
      expect(screen.getByText('Item Cost')).toBeInTheDocument()
      expect(screen.getByText('100.0')).toBeInTheDocument()
    })

    it('should display the network selector', () => {
      expect(screen.getByText('Polygon')).toBeInTheDocument()
    })

    it('should display the token balance', () => {
      expect(screen.getByText(/Balance/)).toBeInTheDocument()
      expect(screen.getByText('1000.00')).toBeInTheDocument()
    })

    it('should allow clicking on network selector', () => {
      const networkSelector = screen.getByTestId('chain-selector')
      networkSelector.click()
      expect(onShowChainSelector).toHaveBeenCalled()
    })

    it('should allow clicking on token selector', () => {
      const tokenSelector = screen.getByTestId('token-selector')
      tokenSelector.click()
      expect(onShowTokenSelector).toHaveBeenCalled()
    })
  })

  describe('and credits are being used', () => {
    beforeEach(() => {
      render(
        <PaymentSelector
          price={price}
          shouldUseCrossChainProvider={true}
          isBuyingAsset={false}
          amountInSelectedToken="100"
          route={undefined}
          routeFeeCost={undefined}
          gasCost={{
            total: '2.0',
            totalUSDPrice: 0.6,
            token: selectedToken
          }}
          isFetchingGasCost={false}
          providerTokens={providerTokens}
          selectedToken={selectedToken}
          selectedChain={selectedChain}
          wallet={wallet}
          selectedProviderChain={selectedProviderChain}
          isFetchingBalance={false}
          selectedTokenBalance={BigNumber.from('1000000000000000000000')}
          onShowChainSelector={onShowChainSelector}
          onShowTokenSelector={onShowTokenSelector}
          useCredits={true}
        />
      )
    })

    it('should display the item cost', () => {
      expect(screen.getByText('Item Cost')).toBeInTheDocument()
      expect(screen.getByText('100.0')).toBeInTheDocument()
    })

    it('should display the estimated fee with strikethrough and 0', () => {
      expect(screen.getByText('Estimated Fee')).toBeInTheDocument()

      // Original fee should be visible (struck through via CSS)
      const priceContainer = screen.getByText('Estimated Fee').closest('.itemCost')
      const originalPrice = priceContainer?.querySelector('.originalPrice')
      expect(originalPrice).toBeInTheDocument()
      expect(originalPrice?.textContent).toBe('2')

      // Adjusted fee should be 0
      const adjustedFee = screen.getByText('0')
      expect(adjustedFee).toBeInTheDocument()
    })

    it('should disable the network selector', () => {
      const networkSelector = screen.getByTestId('chain-selector')
      expect(networkSelector).toHaveClass('dropdownDisabled')
    })

    it('should disable the token selector', () => {
      const tokenSelector = screen.getByTestId('token-selector')
      expect(tokenSelector).toHaveClass('dropdownDisabled')
    })
  })
})
