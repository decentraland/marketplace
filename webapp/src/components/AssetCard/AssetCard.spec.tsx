import { mockAllIsIntersecting } from 'react-intersection-observer/test-utils'
import { act, fireEvent, screen } from '@testing-library/react'
import { BodyShape, ChainId, Network, NFTCategory, Rarity, WearableCategory } from '@dcl/schemas'
import { Asset } from '../../modules/asset/types'
import { INITIAL_STATE } from '../../modules/favorites/reducer'
import { PageName, SortBy } from '../../modules/routing/types'
import { useTradePriceDenomination } from '../../modules/trade/hooks'
import { renderWithProviders } from '../../utils/test'
import { HoverPreviewProvider } from '../HoverPreview'
import AssetCard from './AssetCard'
import { Props as AssetCardProps } from './AssetCard.types'

const FAVORITES_COUNTER_TEST_ID = 'favorites-counter'
const HOVER_INTENT_MS = 120

// The two reads the pegged path depends on: which unit the listing is in, and the rate to convert it.
// Both are network calls in production; here they are dials so a test can state the situation it means.
jest.mock('../../modules/trade/hooks', () => ({
  useTradePriceDenomination: jest.fn(() => 'mana'),
  useManaUsdRate: jest.fn(() => ({ answer: 100000000n, decimals: 8 }))
}))

function renderAssetCard(props: Partial<AssetCardProps> = {}) {
  return renderWithProviders(
    <AssetCard
      asset={{} as Asset}
      price={null}
      isClaimingBackLandTransactionPending={false}
      showRentalChip={false}
      rental={null}
      sortBy={SortBy.RECENTLY_LISTED}
      appliedFilters={{ maxPrice: '100', minPrice: '1' }}
      pageName={PageName.ACCOUNT}
      isSocialEmotesEnabled={false}
      {...props}
    />,
    {
      preloadedState: {
        favorites: {
          ...INITIAL_STATE,
          data: {
            items: {
              '0xContractAddress-itemId': { pickedByUser: false, count: 35 }
            },
            lists: {}
          }
        }
      }
    }
  )
}

describe('AssetCard', () => {
  let asset: Asset

  beforeEach(() => {
    asset = {
      id: '0xContractAddress-itemId',
      name: 'assetName',
      urn: '',
      thumbnail: 'assetThumbnail',
      url: 'assetUrl',
      category: NFTCategory.WEARABLE,
      contractAddress: '0xContractAddress',
      itemId: '',
      rarity: Rarity.UNIQUE,
      price: '5000000000000000',
      available: 0,
      isOnSale: false,
      creator: '0xCreator',
      beneficiary: null,
      createdAt: 0,
      updatedAt: 0,
      reviewedAt: 0,
      soldAt: 0,
      data: {
        wearable: {
          rarity: Rarity.UNIQUE,
          category: WearableCategory.BODY_SHAPE,
          bodyShapes: [BodyShape.MALE]
        } as Asset['data']['wearable']
      },
      network: Network.MATIC,
      chainId: ChainId.MATIC_AMOY,
      firstListedAt: null
    }
  })

  it('should render the Asset Card', () => {
    renderAssetCard({ asset })
  })

  describe('when its interesected', () => {
    it('should render the Asset Card content', () => {
      renderAssetCard({
        asset
      })
      mockAllIsIntersecting(true)
      expect(screen.getByTestId('asset-card-content')).toBeInTheDocument()
    })
  })

  describe('when its not interesected', () => {
    it('should not render the Asset Card content', () => {
      renderAssetCard({
        asset
      })
      expect(screen.queryByTestId('asset-card-content')).not.toBeInTheDocument()
    })
  })

  describe('when the asset is an item', () => {
    beforeEach(() => {
      asset = { ...asset, itemId: 'itemId' } as Asset
    })

    it('should render the favorites counter', () => {
      renderAssetCard({
        asset
      })
      mockAllIsIntersecting(true)
      expect(screen.getByTestId(FAVORITES_COUNTER_TEST_ID)).toBeInTheDocument()
    })
  })

  describe('when the asset is an nft', () => {
    beforeEach(() => {
      asset = { ...asset, tokenId: 'tokenId' } as Asset
    })

    it('should not render the favorites counter', () => {
      const { queryByTestId } = renderAssetCard({
        asset
      })
      expect(queryByTestId(FAVORITES_COUNTER_TEST_ID)).toBeNull()
    })
  })

  /**
   * A USD-pegged listing carries USD wei in `price`, so drawing it with the MANA glyph tells the shopper
   * the item costs a fraction of what it does. The catalog card renders through its own path, which is why
   * the item page being right did not make the grid right.
   */
  describe('when the catalog card shows a USD-pegged mint price', () => {
    let catalogAsset: Asset

    beforeEach(() => {
      // $1 per MANA, so the converted figure is a round number the assertion can name.
      ;(useTradePriceDenomination as jest.Mock).mockReturnValue('usd-pegged')
      catalogAsset = {
        ...asset,
        itemId: '0',
        price: '20100000000000000000',
        isOnSale: true,
        available: 43,
        listings: 0,
        minPrice: '20100000000000000000'
      } as unknown as Asset
    })

    it('should convert it through the rate instead of labelling the dollars as MANA', () => {
      renderAssetCard({ asset: catalogAsset, priceTradeId: 'trade-1', sortBy: SortBy.NEWEST })
      mockAllIsIntersecting(true)

      expect(screen.getByTestId('pegged-mana-price')).toBeInTheDocument()
    })

    // The same card must NOT convert a resale figure: those are already MANA, and running them through
    // the rate would be this bug pointing the other way.
    it('should leave the price alone when it is not the mint price', () => {
      const withResale = { ...catalogAsset, price: '20100000000000000000', minPrice: '5000000000000000000' } as unknown as Asset
      renderAssetCard({ asset: withResale, priceTradeId: 'trade-1', sortBy: SortBy.CHEAPEST })
      mockAllIsIntersecting(true)

      expect(screen.queryByTestId('pegged-mana-price')).toBeNull()
    })
  })

  describe('when the card is hovered on a device with a real pointer', () => {
    beforeEach(() => {
      jest.useFakeTimers()
      // The card arms the 3D preview only where hovering is a deliberate act; the global stub in
      // beforeSetupTests answers false to every query, which would disarm it here.
      jest.spyOn(window, 'matchMedia').mockImplementation(
        query =>
          ({
            matches: query === '(hover: hover) and (pointer: fine)',
            media: query,
            addListener: () => undefined,
            removeListener: () => undefined,
            addEventListener: () => undefined,
            removeEventListener: () => undefined,
            dispatchEvent: () => false
          }) as unknown as MediaQueryList
      )
    })

    afterEach(() => {
      jest.useRealTimers()
      jest.restoreAllMocks()
    })

    const renderHoveredCard = (hovered: Asset) => {
      const rendered = renderWithProviders(
        <HoverPreviewProvider enabled>
          <AssetCard
            asset={hovered}
            price={null}
            isClaimingBackLandTransactionPending={false}
            showRentalChip={false}
            rental={null}
            sortBy={SortBy.RECENTLY_LISTED}
            appliedFilters={{}}
            pageName={PageName.ACCOUNT}
            isSocialEmotesEnabled={false}
          />
        </HoverPreviewProvider>
      )
      mockAllIsIntersecting(true)
      fireEvent.mouseEnter(rendered.container.firstChild as HTMLElement)
      // Let the hover-intent delay elapse, which is what actually asks for the 3D preview.
      act(() => {
        jest.advanceTimersByTime(HOVER_INTENT_MS)
      })
      return rendered
    }

    it('should show the 3D preview over a wearable card', () => {
      renderHoveredCard(asset)
      expect(document.querySelector('.HoverPreview')).toHaveClass('is-visible')
    })

    it('should not show it over a card without a 3D model', () => {
      renderHoveredCard({ ...asset, category: NFTCategory.ENS, data: { ens: { subdomain: 'name' } } } as unknown as Asset)
      expect(document.querySelector('.HoverPreview')).toHaveClass('is-warming')
    })
  })
})
