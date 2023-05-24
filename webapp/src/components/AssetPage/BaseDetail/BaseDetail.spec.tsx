import { within } from '@testing-library/dom'
import { useMobileMediaQuery } from 'decentraland-ui/dist/components/Media'
import { Asset } from '../../../modules/asset/types'
import { INITIAL_STATE } from '../../../modules/favorites/reducer'
import { renderWithProviders } from '../../../utils/test'
import BaseDetail from './BaseDetail'
import { Props as BaseDetailProps } from './BaseDetail.types'

jest.mock('decentraland-ui/dist/components/Media')

const BASE_DETAIL_TOP_HEADER = 'top-header'
const FAVORITES_COUNTER_TEST_ID = 'favorites-counter'

function renderBaseDetail(props: Partial<BaseDetailProps> = {}) {
  return renderWithProviders(
    <BaseDetail
      asset={{} as Asset}
      assetImage={undefined}
      badges={undefined}
      left={undefined}
      box={undefined}
      onBack={jest.fn()}
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
            lists: {}
          }
        }
      }
    }
  )
}

describe('BaseDetail', () => {
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

    it('should not render the favorites counter in the top-header', async () => {
      const { getByTestId } = renderBaseDetail({
        asset
      })
      expect(
        within(
          getByTestId(BASE_DETAIL_TOP_HEADER) ?? new HTMLElement()
        ).queryByTestId(FAVORITES_COUNTER_TEST_ID)
      ).toBeNull()
    })
  })

  describe('when the dispositive is mobile', () => {
    beforeEach(() => {
      useMobileMediaQueryMock.mockReturnValue(true)
    })

    describe('and the asset is an nft', () => {
      beforeEach(() => {
        asset = { ...asset, tokenId: 'tokenId' } as Asset
      })

      it('should not render the favorites counter in the top-header', () => {
        const { getByTestId } = renderBaseDetail({
          asset
        })
        expect(
          within(
            getByTestId(BASE_DETAIL_TOP_HEADER) ?? new HTMLElement()
          ).queryByTestId(FAVORITES_COUNTER_TEST_ID)
        ).toBeNull()
      })
    })

    describe('and the asset is an item', () => {
      beforeEach(() => {
        asset = { ...asset, itemId: 'itemId' } as Asset
      })

      it('should render the favorites counter', () => {
        const { getByTestId } = renderBaseDetail({
          asset
        })
        expect(
          within(
            getByTestId(BASE_DETAIL_TOP_HEADER) ?? new HTMLElement()
          ).queryByTestId(FAVORITES_COUNTER_TEST_ID)
        ).toBeInTheDocument()
      })
    })
  })
})
