import { ChainId, Item, Network, NFTCategory, Rarity } from '@dcl/schemas'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { getAnalytics } from 'decentraland-dapps/dist/modules/analytics/utils'
import FavoritesCounter from './FavoritesCounter'
import { Props as FavoritesCounterProps } from './FavoritesCounter.types'
import { bulkPickUnpickStart } from '../../modules/favorites/actions'

jest.mock('decentraland-dapps/dist/modules/analytics/utils')
const getAnalyticsMock = getAnalytics as unknown as jest.MockedFunction<typeof getAnalytics>

const FAVORITES_COUNTER_TEST_ID = 'favorites-counter-bubble'
const FAVORITES_COUNTER_NUMBER_TEST_ID = 'favorites-counter-number'

function renderFavoritesCounter(props: Partial<FavoritesCounterProps> = {}) {
  return render(
    <FavoritesCounter
      count={0}
      isLoading={false}
      isPickedByUser={false}
      item={{} as Item}
      onClick={jest.fn()}
      onCounterClick={jest.fn()}
      {...props}
    />
  )
}

describe('FavoritesCounter', () => {
  let item: Item

  beforeEach(() => {
    getAnalyticsMock.mockReturnValue({
      track: jest.fn()
    })
    item = {
      id: 'itemId',
      name: '',
      urn: '',
      thumbnail: '',
      url: '',
      category: NFTCategory.WEARABLE,
      contractAddress: '',
      itemId: '',
      rarity: Rarity.UNIQUE,
      price: '',
      available: 0,
      isOnSale: false,
      creator: '',
      beneficiary: null,
      createdAt: 0,
      updatedAt: 0,
      reviewedAt: 0,
      soldAt: 0,
      data: {},
      network: Network.ETHEREUM,
      chainId: ChainId.ETHEREUM_GOERLI,
      firstListedAt: null
    }
  })

  describe('when the item is not favorited by the user', () => {
    it('should render the favorite counter component with an empty bookmark icon and the number 0', () => {
      const { getByLabelText } = renderFavoritesCounter({
        count: 0,
        isPickedByUser: false,
        item: item
      })
      expect(getByLabelText(t('favorites_counter.pick_label'))).toBeInTheDocument()
    })
  })

  describe('when the item is favorited by the user', () => {
    it('should render the favorite counter component with an empty bookmark icon and the number 0', () => {
      const { getByLabelText } = renderFavoritesCounter({
        count: 0,
        isPickedByUser: true,
        item: item
      })
      expect(getByLabelText(t('favorites_counter.unpick_label'))).toBeInTheDocument()
    })
  })

  describe('when the count of favorites is 0', () => {
    it('should render the favorite counter component with an empty bookmark icon and the number of users that picked it as favorite', () => {
      const { getByText } = renderFavoritesCounter({
        item,
        isPickedByUser: true,
        count: 0
      })
      expect(getByText('0')).toBeInTheDocument()
    })
  })

  describe('when the count of favorites is more than 0', () => {
    it('should render the favorite counter component with an empty bookmark icon and the number of users that picked it as favorite', () => {
      const { getByText } = renderFavoritesCounter({
        item,
        isPickedByUser: true,
        count: 999
      })
      expect(getByText('999')).toBeInTheDocument()
    })
  })

  describe('when the count of favorites is a thousand', () => {
    it('should render the favorite counter using a compact notation of 1K', () => {
      const { getByText } = renderFavoritesCounter({
        item,
        isPickedByUser: true,
        count: 1000
      })
      expect(getByText('1K')).toBeInTheDocument()
    })
  })

  describe('when the count of favorites is 2500', () => {
    it('should render the favorite counter using a compact notation of 2.5K', () => {
      const { getByText } = renderFavoritesCounter({
        item,
        isPickedByUser: true,
        count: 2500
      })
      expect(getByText('2.5K')).toBeInTheDocument()
    })
  })

  describe('when the count of favorites is a million', () => {
    it('should render the favorite counter using a compact notation of 1M', () => {
      const { getByText } = renderFavoritesCounter({
        item,
        isPickedByUser: true,
        count: 1000000
      })
      expect(getByText('1M')).toBeInTheDocument()
    })
  })

  describe('when the user clicks the component', () => {
    let onClick: jest.MockedFunction<() => ReturnType<typeof bulkPickUnpickStart>>

    beforeEach(() => {
      onClick = jest.fn()
    })

    it('should start the pick unpick in bulk mechanism', async () => {
      const { getByTestId } = renderFavoritesCounter({
        item,
        isPickedByUser: false,
        onClick
      })
      await userEvent.click(getByTestId(FAVORITES_COUNTER_TEST_ID))
      expect(onClick).toHaveBeenCalled()
    })

    describe('and the item picking or unpicking in bulk is in progress', () => {
      it('should not start the unpick nor the pick in bulk mechanism again', async () => {
        const { getByTestId } = renderFavoritesCounter({
          item,
          isLoading: true,
          isPickedByUser: true,
          onClick
        })
        await userEvent.click(getByTestId(FAVORITES_COUNTER_TEST_ID))
        expect(onClick).not.toHaveBeenCalled()
      })
    })
  })

  describe('when clicking the counter of an item', () => {
    let onCounterClick: jest.Mock

    beforeEach(() => {
      onCounterClick = jest.fn()
    })

    describe('and the counter has no favorites', () => {
      it('should have the non clickable class', () => {
        const { getByTestId } = renderFavoritesCounter({
          onCounterClick,
          count: 0,
          isCollapsed: true
        })
        expect(getByTestId(FAVORITES_COUNTER_NUMBER_TEST_ID)).toHaveClass('nonClickable')
      })

      it('should not call the onCounterClick prop method', async () => {
        const { getByTestId } = renderFavoritesCounter({
          onCounterClick,
          count: 0,
          isCollapsed: true
        })
        await userEvent.click(getByTestId(FAVORITES_COUNTER_NUMBER_TEST_ID))
        expect(onCounterClick).not.toHaveBeenCalled()
      })
    })

    describe('and the counter has favorites', () => {
      it('should not have the non clickable class', () => {
        const { getByTestId } = renderFavoritesCounter({
          onCounterClick,
          count: 1000,
          isCollapsed: true
        })
        expect(getByTestId(FAVORITES_COUNTER_NUMBER_TEST_ID)).not.toHaveClass('nonClickable')
      })

      it('should call the onCounterClick prop method', async () => {
        const { getByTestId } = renderFavoritesCounter({
          onCounterClick,
          count: 1000,
          isCollapsed: true
        })
        await userEvent.click(getByTestId(FAVORITES_COUNTER_NUMBER_TEST_ID))
        expect(onCounterClick).toHaveBeenCalled()
      })
    })

    describe('and the item picking or unpicking process is being loaded', () => {
      it('should have the non clickable class', () => {
        const { getByTestId } = renderFavoritesCounter({
          onCounterClick,
          count: 0,
          isCollapsed: true,
          isLoading: true
        })
        expect(getByTestId(FAVORITES_COUNTER_NUMBER_TEST_ID)).toHaveClass('nonClickable')
      })

      it('should not call the onCounterClick prop method', async () => {
        const { getByTestId } = renderFavoritesCounter({
          onCounterClick,
          count: 0,
          isCollapsed: true,
          isLoading: true
        })
        await userEvent.click(getByTestId(FAVORITES_COUNTER_NUMBER_TEST_ID))
        expect(onCounterClick).not.toHaveBeenCalled()
      })
    })
  })
})
