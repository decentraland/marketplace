import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { render } from '@testing-library/react'
import configureStore from 'redux-mock-store'
import { ChainId, Network, NFTCategory, Rarity } from '@dcl/schemas'
import { Asset } from '../../modules/asset/types'
import AssetCard from './AssetCard'
import { Props as AssetCardProps } from './AssetCard.types'
import { Middleware } from 'redux'

const middlewares: Middleware[] = []
const mockStore = configureStore(middlewares)
const store = mockStore({})

function renderAssetCard(props: Partial<AssetCardProps> = {}) {
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <AssetCard
          asset={{} as Asset}
          price={null}
          isClaimingBackLandTransactionPending={false}
          showRentalChip={false}
          rental={null}
          isFavoritesEnabled={false}
          {...props}
        />
      </MemoryRouter>
    </Provider>
  )
}

describe('AssetCard', () => {
  let asset: Asset
  let price: string

  beforeEach(() => {
    price = '500000000000000000000'
    asset = {
      id: 'assetId',
      name: 'assetName',
      thumbnail: 'assetThumbnail',
      url: 'assetUrl',
      category: NFTCategory.WEARABLE,
      contractAddress: '0xcontractaddress',
      itemId: '',
      rarity: Rarity.UNIQUE,
      price,
      available: 0,
      isOnSale: false,
      creator: '0xcreator',
      beneficiary: null,
      createdAt: 0,
      updatedAt: 0,
      reviewedAt: 0,
      soldAt: 0,
      data: {},
      network: Network.MATIC,
      chainId: ChainId.MATIC_MUMBAI,
      firstListedAt: null
    }
  })

  describe('when the favorites feature flag is not enabled', () => {
    it('should render the Asset Card without the favorite counter', () => {
      const { getByRole } = renderAssetCard({ asset })
    })
  })
})
