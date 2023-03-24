import { ChainId, Item, Network, NFTCategory, Rarity } from '@dcl/schemas'
import { render } from '@testing-library/react'
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
      const { getByRole } = render(
        <FavoritesCounter count={0} isPickedByUser={false} item={item} />
      )
      expect(getByRole('button', { name: 'pick as favorite' })).toHaveClass(
        'show'
      )
      expect(getByRole('button', { name: 'unpick favorited' })).toHaveClass(
        'hidden'
      )
    })
  })

  describe('when the item is favorited by the user', () => {
    it('should render the favorite counter component with an empty bookmark icon and the number 0', () => {
      const { getByRole } = render(
        <FavoritesCounter count={0} isPickedByUser item={item} />
      )
      expect(getByRole('button', { name: 'pick as favorite' })).toHaveClass(
        'hidden'
      )
      expect(getByRole('button', { name: 'unpick favorited' })).toHaveClass(
        'show'
      )
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
        <FavoritesCounter item={item} isPickedByUser count={55} />
      )
      expect(getByText('55')).toBeInTheDocument()
    })
  })
})
