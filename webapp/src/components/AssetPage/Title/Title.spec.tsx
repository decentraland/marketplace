import { Asset } from '../../../modules/asset/types'
import { getAssetName } from '../../../modules/asset/utils'
import { renderWithProviders } from '../../../utils/test'
import Title from './Title'

const FAVORITES_COUNTER_TEST_ID = 'favorites-counter'

describe('Title', () => {
  let asset: Asset

  beforeEach(() => {
    asset = { name: 'Asset Name' } as Asset
  })

  it('should render the Asset Name', () => {
    const { getByText } = renderWithProviders(
      <Title asset={asset} isFavoritesEnabled />
    )
    expect(getByText(getAssetName(asset))).toBeInTheDocument()
  })

  describe('when the favorites feature flag is not enabled', () => {
    it('should not render the favorites counter', () => {
      const { queryByTestId } = renderWithProviders(
        <Title asset={asset} isFavoritesEnabled={false} />
      )
      expect(queryByTestId(FAVORITES_COUNTER_TEST_ID)).toBeNull()
    })
  })

  describe('when the favorites feature flag is enabled', () => {
    describe('when the asset is an nft', () => {
      beforeEach(() => {
        asset = { ...asset, tokenId: 'tokenId' } as Asset
      })

      it('should not render the favorites counter', () => {
        const { queryByTestId } = renderWithProviders(
          <Title asset={asset} isFavoritesEnabled />
        )
        expect(queryByTestId(FAVORITES_COUNTER_TEST_ID)).toBeNull()
      })
    })

    describe('when the asset is an item', () => {
      beforeEach(() => {
        asset = { ...asset, itemId: 'itemId' } as Asset
      })

      it('should render the favorites counter', () => {
        const { getByTestId } = renderWithProviders(
          <Title asset={asset} isFavoritesEnabled />
        )
        expect(getByTestId(FAVORITES_COUNTER_TEST_ID)).toBeInTheDocument()
      })
    })
  })
})
