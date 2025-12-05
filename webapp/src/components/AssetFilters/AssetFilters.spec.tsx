import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Section } from '../../modules/vendor/decentraland'
import { marketplaceAPI } from '../../modules/vendor/decentraland/marketplace/api'
import { nftMarketplaceAPI } from '../../modules/vendor/decentraland/nft/api'
import { rentalsAPI } from '../../modules/vendor/decentraland/rentals/api'
import { renderWithProviders, waitForComponentToFinishLoading } from '../../utils/test'
import { LANDFilters } from '../Vendor/decentraland/types'
import { AssetFilters } from './AssetFilters'
import { Props } from './AssetFilters.types'

jest.mock('../../modules/vendor/decentraland/nft/api')
jest.mock('../../modules/vendor/decentraland/rentals/api')
jest.mock('../../modules/vendor/decentraland/marketplace/api')

beforeEach(() => {
  ;(nftMarketplaceAPI.fetchPrices as jest.Mock).mockResolvedValue({})
  ;(nftMarketplaceAPI.fetchEstateSizes as jest.Mock).mockResolvedValue({})
  ;(nftMarketplaceAPI.fetchPrices as jest.Mock).mockResolvedValue({})
  ;(nftMarketplaceAPI.fetchEstateSizes as jest.Mock).mockResolvedValue({})
  ;(marketplaceAPI.fetchEstateSizes as jest.Mock).mockResolvedValue({})
  ;(rentalsAPI.getRentalListingsPrices as jest.Mock).mockResolvedValue({})
})

function renderAssetFilters(props: Partial<Props> = {}) {
  return renderWithProviders(
    <AssetFilters
      minPrice="0"
      maxPrice="10"
      minEstateSize="0"
      maxEstateSize="5"
      collection=""
      creators={[]}
      rarities={[]}
      isOnlySmart={false}
      landStatus={LANDFilters.ALL_LAND}
      onBrowse={jest.fn()}
      values={{ section: Section.LAND }}
      {...props}
    />
  )
}

describe('when in land section', () => {
  it('should render land status filter', async () => {
    const screen = renderAssetFilters({ section: Section.LAND })
    await waitForComponentToFinishLoading(screen, { timeout: 10000 })
    expect(screen.getByRole('radio', { name: t('nft_land_filters.all_land') })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: t('nft_land_filters.only_for_sale') })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: t('nft_land_filters.only_for_rent') })).toBeInTheDocument()
  })

  it('should render price filter', async () => {
    const screen = renderAssetFilters({
      section: Section.LAND
    })
    await waitForComponentToFinishLoading(screen)
    // TODO: Make barchart components accessible so we can access better the info ui#311
    expect(screen.getByText(t('filters.price'))).toBeInTheDocument()
  })

  describe('and section is estate', () => {
    it('should render estate size filter', async () => {
      const screen = renderAssetFilters({
        section: Section.ESTATES
      })
      await waitForComponentToFinishLoading(screen)
      // TODO: Make barchart components accesible so we can access better the info ui#311
      expect(screen.getByText(t('filters.estate_size.label'))).toBeInTheDocument()
    })
  })
})
