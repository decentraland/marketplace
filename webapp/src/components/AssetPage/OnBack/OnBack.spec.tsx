import { within } from '@testing-library/dom'
import { useMobileMediaQuery } from 'decentraland-ui/dist/components/Media'
import { Network } from '@dcl/schemas'
import { Asset } from '../../../modules/asset/types'
import { INITIAL_STATE } from '../../../modules/favorites/reducer'
import { renderWithProviders } from '../../../utils/test'
import { Props as OnBackProps } from './OnBack.types'
import OnBack from './OnBack'

jest.mock('decentraland-ui/dist/components/Media')

const BASE_DETAIL_TOP_HEADER = 'top-header'
const FAVORITES_COUNTER_TEST_ID = 'favorites-counter'

function renderOnBack(props: Partial<OnBackProps> = {}) {
  return renderWithProviders(
    <OnBack asset={props.asset || ({} as Asset)} onBack={jest.fn()} />,
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
      const { getByTestId } = renderOnBack({
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

    describe('and the favorites feature flag is not enabled', () => {
      it('should not render the favorites counter', () => {
        const { getByTestId } = renderOnBack({
          asset
        })
        expect(
          within(
            getByTestId(BASE_DETAIL_TOP_HEADER) ?? new HTMLElement()
          ).queryByTestId(FAVORITES_COUNTER_TEST_ID)
        ).toBeNull()
      })
    })

    describe('and the favorites feature flag is enabled', () => {
      describe('and the asset is an nft', () => {
        beforeEach(() => {
          asset = { ...asset, tokenId: 'tokenId' } as Asset
        })

        it('should not render the favorites counter', () => {
          const { queryByTestId } = renderOnBack({
            asset
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
          useMobileMediaQueryMock.mockReturnValue(true)
        })

        it('should render the favorites counter', () => {
          const { getByTestId } = renderOnBack({
            asset
          })
          expect(getByTestId(FAVORITES_COUNTER_TEST_ID)).toBeInTheDocument()
          expect(
            within(
              getByTestId(BASE_DETAIL_TOP_HEADER) ?? new HTMLElement()
            ).queryByTestId(FAVORITES_COUNTER_TEST_ID)
          ).toBeInTheDocument()
        })
      })
    })
  })
})
