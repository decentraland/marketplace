import { render } from '@testing-library/react'
import { AssetType } from '../../modules/asset/types'
import AssetProviderPage from './AssetProviderPage'
import { Props } from './AssetProviderPage.types'

// Render the AssetProvider's children with a controlled asset (variable is `mock`-prefixed so jest allows it)
let mockAsset: unknown = null
jest.mock('../AssetProvider', () => ({
  AssetProvider: ({ children }: { children: (asset: unknown, order: null, rental: null, isLoading: boolean) => React.ReactNode }) =>
    children(mockAsset, null, null, false)
}))

const socialEmote = { data: { emote: { outcomeType: 'simple_outcome' } } }
const regularEmote = { data: { emote: {} } }
const wearable = { data: { wearable: {} } }

function renderAssetProviderPage(props: Partial<Props> = {}) {
  return render(
    <AssetProviderPage type={AssetType.ITEM} isConnecting={false} isSocialEmotesEnabled={false} {...props}>
      {() => <div data-testid="asset-detail">detail</div>}
    </AssetProviderPage>
  )
}

describe('when rendering the AssetProviderPage', () => {
  describe('and the asset is a social emote and the social emotes feature is disabled', () => {
    beforeEach(() => {
      mockAsset = socialEmote
    })

    it('should not render the asset detail', () => {
      const { queryByTestId } = renderAssetProviderPage({ isSocialEmotesEnabled: false })

      expect(queryByTestId('asset-detail')).toBeNull()
    })
  })

  describe('and the asset is a social emote and the social emotes feature is enabled', () => {
    beforeEach(() => {
      mockAsset = socialEmote
    })

    it('should render the asset detail', () => {
      const { queryByTestId } = renderAssetProviderPage({ isSocialEmotesEnabled: true })

      expect(queryByTestId('asset-detail')).not.toBeNull()
    })
  })

  describe('and the asset is a regular emote without an outcome type', () => {
    beforeEach(() => {
      mockAsset = regularEmote
    })

    it('should render the asset detail', () => {
      const { queryByTestId } = renderAssetProviderPage({ isSocialEmotesEnabled: false })

      expect(queryByTestId('asset-detail')).not.toBeNull()
    })
  })

  describe('and the asset is not an emote', () => {
    beforeEach(() => {
      mockAsset = wearable
    })

    it('should render the asset detail', () => {
      const { queryByTestId } = renderAssetProviderPage({ isSocialEmotesEnabled: false })

      expect(queryByTestId('asset-detail')).not.toBeNull()
    })
  })
})
