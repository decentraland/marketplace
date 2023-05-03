import { useMobileMediaQuery } from 'decentraland-ui/dist/components/Media'
import { Asset } from '../../../modules/asset/types'
import { INITIAL_STATE } from '../../../modules/favorites/reducer'
import { renderWithProviders } from '../../../utils/test'
import { Props as OnBackProps } from './OnBack.types'
import OnBack from './OnBack'

jest.mock('decentraland-ui/dist/components/Media')

const FAVORITES_COUNTER_TEST_ID = 'favorites-counter'

function renderOnBack(props: Partial<OnBackProps> = {}) {
  return renderWithProviders(
    <OnBack
      asset={props.asset || ({} as Asset)}
      isFavoritesEnabled={props.isFavoritesEnabled || false}
      onBack={jest.fn()}
    />,
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

describe('OnBack', () => {
  let asset: Asset
  let useMobileMediaQueryMock: jest.MockedFunction<typeof useMobileMediaQuery>

  beforeEach(() => {
    asset = { id: '0xContractAddress-itemId', name: 'Asset Name' } as Asset
    useMobileMediaQueryMock = useMobileMediaQuery as jest.MockedFunction<
      typeof useMobileMediaQuery
    >
  })

  describe('when the dispositive is not mobile', () => {
    beforeEach(() => {
      useMobileMediaQueryMock.mockReturnValue(false)
    })

    it('should not render the favorites counter', () => {
      const { queryByTestId } = renderOnBack({
        asset,
        isFavoritesEnabled: false
      })
      expect(queryByTestId(FAVORITES_COUNTER_TEST_ID)).toBeNull()
    })
  })

  describe('when the dispositive is mobile', () => {
    beforeEach(() => {
      useMobileMediaQueryMock.mockReturnValue(true)
    })

    describe('and the favorites feature flag is not enabled', () => {
      it('should not render the favorites counter', () => {
        const { queryByTestId } = renderOnBack({
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
          const { queryByTestId } = renderOnBack({
            asset,
            isFavoritesEnabled: true
          })
          expect(queryByTestId(FAVORITES_COUNTER_TEST_ID)).toBeNull()
        })
      })

      describe('and the asset is an item', () => {
        beforeEach(() => {
          asset = { ...asset, itemId: 'itemId' } as Asset
          useMobileMediaQueryMock.mockReturnValue(true)
        })

        it('should render the favorites counter', () => {
          const { getByTestId } = renderOnBack({
            asset,
            isFavoritesEnabled: true
          })
          expect(getByTestId(FAVORITES_COUNTER_TEST_ID)).toBeInTheDocument()
        })
      })
    })
  })
})
