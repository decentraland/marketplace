import { act, fireEvent, RenderResult, screen } from '@testing-library/react'
import { ChainId, Network, TradeAssetType } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { getBuilderCollectionDetailUrl } from '../../modules/collection/utils'
import { locations } from '../../modules/routing/locations'
import { CancellationReason, CancelledTrade, CancelledTradeType } from '../../modules/vendor/decentraland/cancelledTrades/types'
import { renderWithProviders } from '../../utils/test'
import CancelledOrdersBanner from './CancelledOrdersBanner'
import { isCancelledOrdersBannerDismissed } from './utils'

jest.mock('decentraland-dapps/dist/lib/eth', () => {
  const actual: typeof import('decentraland-dapps/dist/lib/eth') = jest.requireActual('decentraland-dapps/dist/lib/eth')
  return { ...actual, getChainIdByNetwork: () => 137 }
})

// $0.05 per MANA
jest.mock('../../modules/trade/manaRate', () => {
  const actual: typeof import('../../modules/trade/manaRate') = jest.requireActual('../../modules/trade/manaRate')
  return { ...actual, fetchManaUsdRate: jest.fn().mockResolvedValue({ answer: 5000000n, decimals: 8 }) }
})

const ADDRESS = '0xabc0000000000000000000000000000000000001'
const CANCELLED_AT = 1700000000000

let trades: CancelledTrade[]
let total: number
let hasMore: boolean
let isLoadingMore: boolean
let error: string | null
let onLoadMore: jest.Mock
let renderResult: RenderResult

const renderBanner = () =>
  renderWithProviders(
    <CancelledOrdersBanner
      address={ADDRESS}
      trades={trades}
      total={total}
      hasMore={hasMore}
      isLoadingMore={isLoadingMore}
      error={error}
      onLoadMore={onLoadMore}
    />
  )

const openModal = () => fireEvent.click(screen.getByRole('button', { name: t('cancelled_orders_banner.cta') }))

beforeEach(() => {
  trades = [
    {
      id: 'a-listing-id',
      type: CancelledTradeType.PUBLIC_NFT_ORDER,
      network: Network.MATIC,
      chainId: ChainId.MATIC_MAINNET,
      contract: '0xmarketplace',
      reason: CancellationReason.CONTRACT_SIGNATURE_INDEX_BUMP,
      createdAt: 0,
      expiresAt: 0,
      cancelledAt: CANCELLED_AT,
      asset: { contractAddress: '0xcontract', tokenId: '12', itemId: null, name: 'Cyber Jacket', image: null },
      price: { assetType: TradeAssetType.ERC20, amount: '25000000000000000000' }
    }
  ]
  total = 1
  hasMore = false
  isLoadingMore = false
  error = null
  onLoadMore = jest.fn()
})

afterEach(() => {
  localStorage.clear()
})

describe('when the wallet has cancelled orders', () => {
  beforeEach(() => {
    renderResult = renderBanner()
  })

  it('should tell the user their orders were cancelled by the upgrade', () => {
    expect(screen.getByRole('status')).toHaveTextContent(t('cancelled_orders_banner.message', { count: total }))
  })
})

describe('when the user reviews the cancelled orders', () => {
  beforeEach(() => {
    renderResult = renderBanner()
    openModal()
  })

  it('should list each affected order with its name', () => {
    expect(screen.getByRole('list', { name: t('cancelled_orders_banner.modal_title') })).toHaveTextContent('Cyber Jacket')
  })

  it('should show the price of the order in MANA', () => {
    expect(screen.getByRole('listitem')).toHaveTextContent('25')
  })

  it('should link to the page to re-create the order', () => {
    expect(screen.getByRole('link', { name: t('cancelled_orders_banner.recreate') })).toHaveAttribute(
      'href',
      locations.sell('0xcontract', '12')
    )
  })
})

describe('when the user reviews a cancelled USD-pegged listing', () => {
  beforeEach(async () => {
    trades = [{ ...trades[0], price: { assetType: TradeAssetType.USD_PEGGED_MANA, amount: '25000000000000000000' } }]
    renderResult = renderBanner()
    openModal()
    await screen.findByTestId('pegged-mana-price')
  })

  it('should show the price converted from USD to MANA', () => {
    expect(screen.getByTestId('pegged-mana-price')).toHaveTextContent('~500')
  })
})

describe('when the user reviews a cancelled item listing', () => {
  beforeEach(() => {
    trades = [
      {
        ...trades[0],
        id: 'an-item-listing-id',
        type: CancelledTradeType.PUBLIC_ITEM_ORDER,
        asset: { contractAddress: '0xcontract', tokenId: null, itemId: '3', name: 'Neon Hat', image: null }
      }
    ]
    renderResult = renderBanner()
    openModal()
  })

  it('should tell the user it is re-created in the Builder', () => {
    expect(screen.getByRole('listitem')).toHaveTextContent(t('cancelled_orders_banner.recreated_in_builder'))
  })

  it('should re-create it in the Builder, in a new tab', () => {
    const link = screen.getByRole('link', { name: t('cancelled_orders_banner.recreate') })
    expect([link.getAttribute('href'), link.getAttribute('target')]).toEqual([getBuilderCollectionDetailUrl('0xcontract'), '_blank'])
  })
})

describe('when the wallet has more cancelled orders than the ones loaded', () => {
  let observerCallback: IntersectionObserverCallback

  beforeEach(() => {
    total = 500
    hasMore = true
    window.IntersectionObserver = jest.fn((callback: IntersectionObserverCallback) => {
      observerCallback = callback
      return { observe: jest.fn(), disconnect: jest.fn() }
    }) as unknown as typeof IntersectionObserver
  })

  afterEach(() => {
    delete (window as Partial<typeof window>).IntersectionObserver
  })

  describe('and the user reviews them', () => {
    beforeEach(() => {
      renderResult = renderBanner()
      openModal()
    })

    it('should show how many orders there are to review', () => {
      expect(screen.getByText(t('cancelled_orders_banner.count', { count: total }))).toBeInTheDocument()
    })
  })

  describe('and the user scrolls to the end of the list', () => {
    beforeEach(() => {
      renderResult = renderBanner()
      openModal()
      act(() => observerCallback([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver))
    })

    it('should load the next page of orders', () => {
      expect(onLoadMore).toHaveBeenCalledTimes(1)
    })
  })

  describe('and the next page is loading', () => {
    beforeEach(() => {
      isLoadingMore = true
      renderResult = renderBanner()
      openModal()
    })

    it('should tell the user more orders are being loaded', () => {
      expect(screen.getByText(t('cancelled_orders_banner.loading_more'))).toBeInTheDocument()
    })

    it('should not observe the end of the list', () => {
      expect(window.IntersectionObserver).not.toHaveBeenCalled()
    })
  })

  describe('and the next page failed to load', () => {
    beforeEach(() => {
      error = 'an error'
      renderResult = renderBanner()
      openModal()
    })

    it('should tell the user more orders could not be loaded', () => {
      expect(screen.getByRole('alert')).toHaveTextContent(t('cancelled_orders_banner.load_more_error'))
    })

    describe('and the user tries again', () => {
      beforeEach(() => {
        fireEvent.click(screen.getByRole('button', { name: t('cancelled_orders_banner.retry') }))
      })

      it('should load the next page of orders', () => {
        expect(onLoadMore).toHaveBeenCalledTimes(1)
      })
    })
  })
})

describe('when the user dismisses the banner', () => {
  beforeEach(() => {
    renderResult = renderBanner()
    fireEvent.click(screen.getByRole('button', { name: t('cancelled_orders_banner.dismiss') }))
  })

  it('should hide the banner', () => {
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('should remember the dismissal up to the newest cancellation', () => {
    expect(isCancelledOrdersBannerDismissed(ADDRESS, CANCELLED_AT)).toBe(true)
  })
})

describe('when the banner was dismissed for the same cancellations before', () => {
  beforeEach(() => {
    localStorage.setItem(`cancelled-orders-banner:${ADDRESS}`, CANCELLED_AT.toString())
    renderResult = renderBanner()
  })

  it('should not render the banner', () => {
    expect(renderResult.queryByRole('status')).not.toBeInTheDocument()
  })
})

describe('when the banner was dismissed before newer cancellations', () => {
  beforeEach(() => {
    localStorage.setItem(`cancelled-orders-banner:${ADDRESS}`, (CANCELLED_AT - 1).toString())
    renderResult = renderBanner()
  })

  it('should render the banner', () => {
    expect(renderResult.getByRole('status')).toBeInTheDocument()
  })
})
