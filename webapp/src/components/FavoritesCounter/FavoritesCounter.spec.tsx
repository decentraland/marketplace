import { ChainId, Item, Network, NFTCategory, Rarity } from '@dcl/schemas'
import { render } from '@testing-library/react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import FavoritesCounter from './FavoritesCounter'

describe('FavoritesCounter', () => {
  let item: Item

  beforeEach(() => {
    item = {
      id: 'itemId',
      name: '',
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
      const { getByLabelText } = render(
        <FavoritesCounter count={0} isPickedByUser={false} item={item} />
      )
      expect(
        getByLabelText(t('favorites_counter.pick_label'))
      ).toBeInTheDocument()
    })
  })

  describe('when the item is favorited by the user', () => {
    it('should render the favorite counter component with an empty bookmark icon and the number 0', () => {
      const { getByLabelText } = render(
        <FavoritesCounter count={0} isPickedByUser item={item} />
      )
      expect(
        getByLabelText(t('favorites_counter.unpick_label'))
      ).toBeInTheDocument()
    })
  })

  describe('when the count of favorites is 0', () => {
    it('should render the favorite counter component with an empty bookmark icon and the number of users that picked it as favorite', () => {
      const { getByText } = render(
        <FavoritesCounter item={item} isPickedByUser count={0} />
      )
      expect(getByText('0')).toBeInTheDocument()
    })
  })

  describe('when the count of favorites is more than 0', () => {
    it('should render the favorite counter component with an empty bookmark icon and the number of users that picked it as favorite', () => {
      const { getByText } = render(
        <FavoritesCounter item={item} isPickedByUser count={999} />
      )
      expect(getByText('999')).toBeInTheDocument()
    })
  })

  describe('when the count of favorites is a thousand', () => {
    it('should render the favorite counter using a compact notation of 1K', () => {
      const { getByText } = render(
        <FavoritesCounter item={item} isPickedByUser count={1000} />
      )
      expect(getByText('1K')).toBeInTheDocument()
    })
  })

  describe('when the count of favorites is 2500', () => {
    it('should render the favorite counter using a compact notation of 2.5K', () => {
      const { getByText } = render(
        <FavoritesCounter item={item} isPickedByUser count={2500} />
      )
      expect(getByText('2.5K')).toBeInTheDocument()
    })
  })

  describe('when the count of favorites is a million', () => {
    it('should render the favorite counter using a compact notation of 1M', () => {
      const { getByText } = render(
        <FavoritesCounter item={item} isPickedByUser count={1000000} />
      )
      expect(getByText('1M')).toBeInTheDocument()
    })
  })
})
