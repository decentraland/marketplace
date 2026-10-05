import { fireEvent, RenderResult, screen } from '@testing-library/react'
import { ChainId, Network } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { getBuilderCollectionDetailUrl } from '../../modules/collection/utils'
import { locations } from '../../modules/routing/locations'
import { CancellationReason, CancelledTrade, CancelledTradeType } from '../../modules/vendor/decentraland/cancelledTrades/types'
import { renderWithProviders } from '../../utils/test'
import CancelledOrdersBanner from './CancelledOrdersBanner'
import { isCancelledOrdersBannerDismissed } from './utils'

const ADDRESS = '0xabc0000000000000000000000000000000000001'

let trades: CancelledTrade[]
let total: number
let renderResult: RenderResult

const renderBanner = () => renderWithProviders(<CancelledOrdersBanner address={ADDRESS} trades={trades} total={total} />)

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
      cancelledAt: 0,
      asset: { contractAddress: '0xcontract', tokenId: '12', itemId: null, name: 'Cyber Jacket', image: null },
      price: { assetType: 1, amount: '25000000000000000000' }
    }
  ]
  total = 1
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
    fireEvent.click(screen.getByRole('button', { name: t('cancelled_orders_banner.cta') }))
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
    fireEvent.click(screen.getByRole('button', { name: t('cancelled_orders_banner.cta') }))
  })

  it('should tell the user it is re-created in the Builder', () => {
    expect(screen.getByRole('listitem')).toHaveTextContent(t('cancelled_orders_banner.recreated_in_builder'))
  })

  it('should re-create it in the Builder, in a new tab', () => {
    const link = screen.getByRole('link', { name: t('cancelled_orders_banner.recreate') })
    expect([link.getAttribute('href'), link.getAttribute('target')]).toEqual([getBuilderCollectionDetailUrl('0xcontract'), '_blank'])
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

  it('should remember the dismissal for this wallet and count', () => {
    expect(isCancelledOrdersBannerDismissed(ADDRESS, total)).toBe(true)
  })
})

describe('when the banner was dismissed for the same count before', () => {
  beforeEach(() => {
    localStorage.setItem(`cancelled-orders-banner:${ADDRESS}`, '1')
    renderResult = renderBanner()
  })

  it('should not render the banner', () => {
    expect(renderResult.queryByRole('status')).not.toBeInTheDocument()
  })
})
