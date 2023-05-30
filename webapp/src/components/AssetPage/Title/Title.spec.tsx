import { useMobileMediaQuery } from 'decentraland-ui/dist/components/Media'
import { Network } from '@dcl/schemas'
import { Asset } from '../../../modules/asset/types'
import { getAssetName } from '../../../modules/asset/utils'
import { INITIAL_STATE } from '../../../modules/favorites/reducer'
import { renderWithProviders } from '../../../utils/test'
import Title from './Title'
import { Props as TitleProps } from './Title.types'

jest.mock('decentraland-ui/dist/components/Media')

const FAVORITES_COUNTER_TEST_ID = 'favorites-counter'

function renderTitle(props: Partial<TitleProps> = {}) {
  return renderWithProviders(
    <Title asset={{} as Asset} isFavoritesEnabled={false} {...props} />,
    {
      preloadedState: {
        favorites: {
          ...INITIAL_STATE,
          data: {
            items: {
              '0xContractAddress-itemId': { pickedByUser: false, count: 35 }
            },
            total: 0
          }
        }
      }
    }
  )
}

describe('Title', () => {
  let asset: Asset
  let useMobileMediaQueryMock: jest.MockedFunction<typeof useMobileMediaQuery>

  beforeEach(() => {
    asset = { id: '0xContractAddress-itemId', name: 'Asset Name' } as Asset
    useMobileMediaQueryMock = useMobileMediaQuery as jest.MockedFunction<
      typeof useMobileMediaQuery
    >
  })

  it('should render the Asset Name', () => {
    const { getByText } = renderTitle({ asset, isFavoritesEnabled: true })
    expect(getByText(getAssetName(asset))).toBeInTheDocument()
  })

  describe('when the dispositive is mobile', () => {
    beforeEach(() => {
      useMobileMediaQueryMock.mockReturnValue(true)
    })

    it('should not render the favorites counter', () => {
      const { queryByTestId } = renderTitle({
        asset,
        isFavoritesEnabled: false
      })
      expect(queryByTestId(FAVORITES_COUNTER_TEST_ID)).toBeNull()
    })
  })

  describe('when the dispositive is not mobile', () => {
    beforeEach(() => {
      useMobileMediaQueryMock.mockReturnValue(false)
    })

    describe('and the favorites feature flag is not enabled', () => {
      it('should not render the favorites counter', () => {
        const { queryByTestId } = renderTitle({
          asset,
          isFavoritesEnabled: false
        })
        expect(queryByTestId(FAVORITES_COUNTER_TEST_ID)).toBeNull()
      })
    })

    describe('and the favorites feature flag is enabled', () => {
      describe('and the asset is an nft', () => {
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

      describe('and the asset is an item', () => {
        beforeEach(() => {
          asset = {
            ...asset,
            itemId: 'itemId',
            network: Network.MATIC
          } as Asset
        })

        it('should render the favorites counter', () => {
          const { getByTestId } = renderTitle({
            asset,
            isFavoritesEnabled: true
          })
          expect(getByTestId(FAVORITES_COUNTER_TEST_ID)).toBeInTheDocument()
        })
      })
    })
  })
})
