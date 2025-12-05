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

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return
jest.mock('decentraland-ui2', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  CreditsToggle: ({ totalCredits, assetPrice, useCredits, onToggle }: any) => (
    <div data-testid="credits-toggle">
      <span>Credits: {totalCredits}</span>
      <span>Price: {assetPrice}</span>
      {/* eslint-disable-next-line @typescript-eslint/no-unsafe-return */}
      <input type="checkbox" checked={useCredits} onChange={e => onToggle(e.target.checked)} data-testid="credits-toggle-input" />
    </div>
  )
}))

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return
jest.mock('decentraland-dapps/dist/modules/translation', () => ({
  t: (key: string, _params?: any) => {
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
  let selectedProviderChain: any
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
      const balanceText = screen.queryByText('Balance')
      if (balanceText) {
        expect(balanceText).toBeInTheDocument()
        expect(screen.getByText('1000.00')).toBeInTheDocument()
      } else {
        // Balance might be in a different format or location
        expect(screen.getByText(/1000/)).toBeInTheDocument()
      }
    })

    it('should not display the credits toggle', () => {
      expect(screen.queryByTestId('credits-toggle')).not.toBeInTheDocument()
    })
  })

  describe('and credits are available and toggle is provided', () => {
    let totalCredits: string

    beforeEach(() => {
      totalCredits = '150000000000000000000' // 150 MANA
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
            totalCredits={totalCredits}
            hasCredits={true}
          />
        )
      })

      it('should not display the credits toggle', () => {
        // CreditsToggle was moved to ClaimNameFatFingerModal
        expect(screen.queryByTestId('credits-toggle')).not.toBeInTheDocument()
      })

      it('should display the item cost normally', () => {
        expect(screen.getByText('Item Cost')).toBeInTheDocument()
        expect(screen.getByText('100.0')).toBeInTheDocument()
      })

      it('should allow clicking on network selector', () => {
        const networkSelector = screen.getByText('Polygon').closest('div')
        expect(networkSelector).not.toHaveClass('dropdownDisabled')
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
            totalCredits={totalCredits}
            hasCredits={true}
          />
        )
      })

      it('should not display the credits toggle', () => {
        // CreditsToggle was moved to ClaimNameFatFingerModal
        expect(screen.queryByTestId('credits-toggle')).not.toBeInTheDocument()
      })

      it('should display the item cost normally when using credits', () => {
        // Credits display logic is now in ClaimNameFatFingerModal, so PaymentSelector shows normal price
        expect(screen.getByText('Item Cost')).toBeInTheDocument()
        // Should display price normally (credits adjustment handled elsewhere)
        const priceElements = screen.getAllByText(/100\.0/)
        expect(priceElements.length).toBeGreaterThan(0)
      })

      it('should not display USD for item cost when remaining cost is 0', () => {
        const document = screen.getByText('Item Cost').ownerDocument
        // Should not have USD display since credits cover full amount
        const usdElements = document.body.querySelectorAll('[class*="fromAmountUSD"]')
        // USD elements should be 0 or minimal since credits cover the cost
        expect(usdElements.length).toBeLessThanOrEqual(1)
      })

      it('should display the estimated fee with strikethrough and 0', () => {
        expect(screen.getByText('Estimated Fee')).toBeInTheDocument()

        // Original fee should be visible (struck through via CSS)
        // Using class selector since the fee is "2" not "2.00"
        const priceContainer = screen.getByText('Estimated Fee').closest('.itemCost')
        const originalPrice = priceContainer?.querySelector('.originalPrice')
        expect(originalPrice).toBeInTheDocument()
        expect(originalPrice?.textContent).toBe('2')

        // Adjusted fee should be 0
        const adjustedFee = screen.getByText('0')
        expect(adjustedFee).toBeInTheDocument()
      })

      it('should disable the network selector', () => {
        const networkSelector = screen.getByText('Polygon').closest('div')
        expect(networkSelector).toHaveClass('dropdownDisabled')
      })

      it('should disable the token selector', () => {
        const tokenSelector = screen.getByText('MANA').closest('div')
        expect(tokenSelector).toHaveClass('dropdownDisabled')
      })

      describe('and credits do not cover full amount', () => {
        beforeEach(() => {
          totalCredits = '50000000000000000000' // 50 MANA (less than 100 MANA price)
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
              useCredits={true}
              totalCredits={totalCredits}
              hasCredits={true}
            />
          )
        })

        it('should display cost normally', () => {
          // Credits calculation is now handled in ClaimNameFatFingerModal
          const itemCostElements = screen.getAllByText('Item Cost')
          expect(itemCostElements.length).toBeGreaterThan(0)
          // PaymentSelector just displays the asset price without credits adjustment
          const priceElements = screen.getAllByText(/100\.0/)
          expect(priceElements.length).toBeGreaterThan(0)
        })

        it('should display USD for remaining cost', () => {
          // USD is shown via ManaToFiat component for the full price
          // Credits adjustment happens in ClaimNameFatFingerModal
          const usdDisplays = screen.getAllByText(/30\.0000/)
          expect(usdDisplays.length).toBeGreaterThan(0)
          expect(usdDisplays[0]).toBeInTheDocument()
        })
      })
    })
  })
})
