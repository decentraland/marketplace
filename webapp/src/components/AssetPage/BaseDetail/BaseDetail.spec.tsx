import { isMobile } from 'decentraland-dapps/dist/lib/utils'
import { Asset } from '../../../modules/asset/types'
import { INITIAL_STATE } from '../../../modules/favorites/reducer'
import { renderWithProviders } from '../../../utils/test'
import BaseDetail from './BaseDetail'
import { Props as BaseDetailProps } from './BaseDetail.types'

jest.mock('decentraland-dapps/dist/lib/utils')

const FAVORITES_COUNTER_TEST_ID = 'favorites-counter'

function renderBaseDetail(props: Partial<BaseDetailProps> = {}) {
  return renderWithProviders(
    <BaseDetail
      asset={{} as Asset}
      assetImage={undefined}
      isFavoritesEnabled={false}
      badges={undefined}
      left={undefined}
      box={undefined}
      isOnSale
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
            total: 0
          }
        }
      }
    }
  )
}

describe('BaseDetail', () => {
  let asset: Asset
  let isMobileMock: jest.MockedFunction<typeof isMobile>

  beforeEach(() => {
    asset = { id: '0xContractAddress-itemId', name: 'Asset Name' } as Asset
    isMobileMock = isMobile as jest.MockedFunction<typeof isMobile>
  })

  describe('when the dispositive is not mobile', () => {
    beforeEach(() => {
      isMobileMock.mockReturnValue(false)
    })

    it('should not render the favorites counter', () => {
      const { queryByTestId } = renderBaseDetail({
        asset,
        isFavoritesEnabled: false
      })
      expect(queryByTestId(FAVORITES_COUNTER_TEST_ID)).toBeNull()
    })
  })

  describe('when the dispositive is mobile', () => {
    beforeEach(() => {
      isMobileMock.mockReturnValue(true)
    })

    describe('and the favorites feature flag is not enabled', () => {
      it('should not render the favorites counter', () => {
        const { queryByTestId } = renderBaseDetail({
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
          const { queryByTestId } = renderBaseDetail({
            asset,
            isFavoritesEnabled: true
          })
          expect(queryByTestId(FAVORITES_COUNTER_TEST_ID)).toBeNull()
        })
      })

      describe('and the asset is an item', () => {
        beforeEach(() => {
          asset = { ...asset, itemId: 'itemId' } as Asset
        })

        it('should render the favorites counter', () => {
          const { getByTestId } = renderBaseDetail({
            asset,
            isFavoritesEnabled: true
          })
          expect(getByTestId(FAVORITES_COUNTER_TEST_ID)).toBeInTheDocument()
        })
      })
    })
  })
})
