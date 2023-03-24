import { render } from '@testing-library/react'
import { Asset } from '../../../modules/asset/types'
import { getAssetName } from '../../../modules/asset/utils'
import Title from './Title'

const FAVORITES_COUNTER_TEST_ID = 'favorites-counter'

describe('Title', () => {
  let asset: Asset

  beforeEach(() => {
    asset = { name: 'Asset Name' } as Asset
  })

  it('should render the Asset Name', () => {
    const { getByText } = render(<Title asset={asset} isFavoritesEnabled />)
    expect(getByText(getAssetName(asset)))
  })

  describe('when the favorites feature flag is not enabled', () => {
    it('should not render the favorites counter', () => {
      const { getByTestId } = render(
        <Title asset={asset} isFavoritesEnabled={false} />
      )
      expect(getByTestId(FAVORITES_COUNTER_TEST_ID)).not.toBeInTheDocument()
    })
  })

  describe('when the favorites feature flag is enabled', () => {
    describe('when the asset is an nft', () => {
      beforeEach(() => {
        asset = { ...asset, tokenId: 'tokenId' } as Asset
      })

      it('should not render the favorites counter', () => {
        const { getByTestId } = render(
          <Title asset={asset} isFavoritesEnabled />
        )
        expect(getByTestId(FAVORITES_COUNTER_TEST_ID)).not.toBeInTheDocument()
      })
    })

    describe('when the asset is an item', () => {
      beforeEach(() => {
        asset = { ...asset, itemId: 'itemId' } as Asset
      })

      it('should not render the favorites counter', () => {
        const { getByTestId } = render(
          <Title asset={asset} isFavoritesEnabled />
        )
        expect(getByTestId(FAVORITES_COUNTER_TEST_ID)).toBeInTheDocument()
      })
    })
  })
})
