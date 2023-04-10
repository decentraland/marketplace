import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Section } from '../../modules/vendor/decentraland'
import {
  renderWithProviders,
  waitForComponentToFinishLoading
} from '../../utils/test'
import { LANDFilters } from '../Vendor/decentraland/types'
import { AssetFilters } from './AssetFilters'
import { Props } from './AssetFilters.types'

jest.mock('../../modules/vendor/decentraland/nft/api', () => {
  const module = jest.requireActual('../../modules/vendor/decentraland/nft/api')
  return {
    ...module,
    nftAPI: {
      fetchPrices: () => ({}),
      fetchEstateSizes: () => ({})
    }
  }
})
jest.mock('../../modules/vendor/decentraland/rentals/api', () => {
  const module = jest.requireActual(
    '../../modules/vendor/decentraland/rentals/api'
  )
  return {
    ...module,
    rentalsAPI: {
      getRentalListingsPrices: () => ({})
    }
  }
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
      isPriceFilterEnabled
      isEstateSizeFilterEnabled
      isLocationFilterEnabled
      isCreatorFiltersEnabled
      isRentalPeriodFilterEnabled
      {...props}
    />
  )
}

describe('when in land section', () => {
  it('should render land status filter', async () => {
    const screen = renderAssetFilters({ section: Section.LAND })
    await waitForComponentToFinishLoading(screen)
    expect(
      screen.getByRole('radio', { name: t('nft_land_filters.all_land') })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('radio', { name: t('nft_land_filters.only_for_sale') })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('radio', { name: t('nft_land_filters.only_for_rent') })
    ).toBeInTheDocument()
  })

  describe('and isPriceFilterEnabled FF is active', () => {
    it('should render price filter', async () => {
      const screen = renderAssetFilters({
        section: Section.LAND,
        isPriceFilterEnabled: true
      })
      await waitForComponentToFinishLoading(screen)
      // TODO: Make barchart components accesible so we can access better the info ui#311
      expect(screen.getByText(t('filters.price'))).toBeInTheDocument()
    })
  })

  describe('and isPriceFilterEnabled FF is off', () => {
    it('should not render price filter', async () => {
      const screen = renderAssetFilters({
        section: Section.LAND,
        isPriceFilterEnabled: false
      })
      await waitForComponentToFinishLoading(screen)
      // TODO: Make barchart components accesible so we can access better the info ui#311
      expect(screen.queryByText(t('filters.price'))).not.toBeInTheDocument()
    })
  })

  describe('and section is estate', () => {
    describe('and isEstateSizeFilterEnabled FF is active', () => {
      it('should render estate size filter', async () => {
        const screen = renderAssetFilters({
          section: Section.ESTATES,
          isEstateSizeFilterEnabled: true
        })
        await waitForComponentToFinishLoading(screen)
        // TODO: Make barchart components accesible so we can access better the info ui#311
        expect(
          screen.getByText(t('filters.estate_size.label'))
        ).toBeInTheDocument()
      })
    })

    describe('and isEstateSizeFilterEnabled FF is off', () => {
      it('should not render estate size filter', async () => {
        const screen = renderAssetFilters({
          section: Section.ESTATES,
          isEstateSizeFilterEnabled: false
        })
        await waitForComponentToFinishLoading(screen)
        // TODO: Make barchart components accesible so we can access better the info ui#311
        expect(
          screen.queryByText(t('filters.estate_size.label'))
        ).not.toBeInTheDocument()
      })
    })
  })
})
