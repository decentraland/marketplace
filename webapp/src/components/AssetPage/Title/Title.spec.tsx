import { Asset } from '../../../modules/asset/types'
import { getAssetName } from '../../../modules/asset/utils'
import { INITIAL_STATE } from '../../../modules/favorites/reducer'
import { renderWithProviders } from '../../../utils/test'
import Title from './Title'
import { Props as TitleProps } from './Title.types'

const FAVORITES_COUNTER_TEST_ID = 'favorites-counter'

function renderTitle(props: Partial<TitleProps> = {}) {
  return renderWithProviders(
    <Title asset={{} as Asset} isFavoritesEnabled={false} {...props} />,
    {
      preloadedState: {
        favorites: {
          ...INITIAL_STATE,
          data: {
            '0xContractAddress-itemId': { pickedByUser: false, count: 35 }
          }
        }
      }
    }
  )
}

describe('Title', () => {
  let asset: Asset

  beforeEach(() => {
    asset = { id: '0xContractAddress-itemId', name: 'Asset Name' } as Asset
  })

  it('should render the Asset Name', () => {
    const { getByText } = renderTitle({ asset, isFavoritesEnabled: true })
    expect(getByText(getAssetName(asset))).toBeInTheDocument()
  })

  describe('when the favorites feature flag is not enabled', () => {
    it('should not render the favorites counter', () => {
      const { queryByTestId } = renderTitle({
        asset,
        isFavoritesEnabled: false
      })
      expect(queryByTestId(FAVORITES_COUNTER_TEST_ID)).toBeNull()
    })
  })

  describe('when the favorites feature flag is enabled', () => {
    describe('when the asset is an nft', () => {
      beforeEach(() => {
        asset = { ...asset, tokenId: 'tokenId' } as Asset
      })

      it('should not render the favorites counter', () => {
        const { queryByTestId } = renderTitle({
          asset,
          isFavoritesEnabled: true
        })
        expect(queryByTestId(FAVORITES_COUNTER_TEST_ID)).toBeNull()
      })
    })

    describe('when the asset is an item', () => {
      beforeEach(() => {
        asset = { ...asset, itemId: 'itemId' } as Asset
      })

      it('should render the favorites counter', () => {
        const { getByTestId } = renderTitle({ asset, isFavoritesEnabled: true })
        expect(getByTestId(FAVORITES_COUNTER_TEST_ID)).toBeInTheDocument()
      })
    })
  })
})
