import { BodyShape, ChainId, Network, NFTCategory, Rarity } from '@dcl/schemas'
import { Asset } from '../../modules/asset/types'
import { INITIAL_STATE } from '../../modules/favorites/reducer'
import { renderWithProviders } from '../../utils/test'
import AssetCard from './AssetCard'
import { Props as AssetCardProps } from './AssetCard.types'

const FAVORITES_COUNTER_TEST_ID = 'favorites-counter'

function renderAssetCard(props: Partial<AssetCardProps> = {}) {
  return renderWithProviders(
    <AssetCard
      asset={{} as Asset}
      price={null}
      isClaimingBackLandTransactionPending={false}
      showRentalChip={false}
      rental={null}
      isFavoritesEnabled={false}
      {...props}
    />,
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

describe('AssetCard', () => {
  let asset: Asset

  beforeEach(() => {
    asset = {
      id: '0xContractAddress-itemId',
      name: 'assetName',
      thumbnail: 'assetThumbnail',
      url: 'assetUrl',
      category: NFTCategory.WEARABLE,
      contractAddress: '0xContractAddress',
      itemId: '',
      rarity: Rarity.UNIQUE,
      price: '5000000000000000',
      available: 0,
      isOnSale: false,
      creator: '0xCreator',
      beneficiary: null,
      createdAt: 0,
      updatedAt: 0,
      reviewedAt: 0,
      soldAt: 0,
      data: {
        wearable: {
          rarity: Rarity.UNIQUE,
          bodyShapes: [BodyShape.MALE]
        } as Asset['data']['wearable']
      },
      network: Network.MATIC,
      chainId: ChainId.MATIC_MUMBAI,
      firstListedAt: null
    }
  })

  it('should render the Asset Card', () => {
    renderAssetCard({ asset })
  })

  describe('when the favorites feature flag is not enabled', () => {
    it('should not render the favorites counter', () => {
      const { queryByTestId } = renderAssetCard({
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
        const { queryByTestId } = renderAssetCard({
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
        const { getByTestId } = renderAssetCard({
          asset,
          isFavoritesEnabled: true
        })
        expect(getByTestId(FAVORITES_COUNTER_TEST_ID)).toBeInTheDocument()
      })
    })
  })
})
