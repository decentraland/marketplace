import { BidSortBy, ChainId, Network } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { NFT } from '../../../../modules/nft/types'
import { marketplaceAPI } from '../../../../modules/vendor/decentraland/marketplace/api'
import { renderWithProviders } from '../../../../utils/test'
import { BidsTableContent } from './BidsTableContent'
import { Props } from './BidsTableContent.types'

jest.mock('../../../../modules/vendor/decentraland/marketplace/api')
jest.mock('../../../../modules/contract/hooks', () => ({ useERC721ContractName: () => 'LAND' }))

const STOLEN_LAND = {
  contractAddress: '0xf87e31492faf9a91b02ee0deaad50d51d56d5d4d',
  tokenId: '115792089237316195423570985008687907802567911994420732983414767500579666133014'
}

function renderBidsTableContent(nft: Partial<NFT>) {
  const props = {
    asset: { id: 'an-id', owner: '0xowner', chainId: ChainId.ETHEREUM_MAINNET, network: Network.ETHEREUM, ...nft } as NFT,
    address: '0xvisitor',
    sortBy: BidSortBy.MOST_EXPENSIVE,
    isAcceptingBid: false,
    onAccept: jest.fn(),
    onAuthorizedAction: jest.fn(),
    onCloseAuthorization: jest.fn(),
    isLoadingAuthorization: false,
    authorizationError: null,
    isMagicAutoSignEnabled: false
  } as unknown as Props
  return renderWithProviders(<BidsTableContent {...props} />)
}

beforeEach(() => {
  ;(marketplaceAPI.fetchBids as jest.Mock).mockResolvedValue({ results: [], total: 0 })
})

describe('when the NFT has no bids', () => {
  describe('and it was not stolen', () => {
    it('should show the make offer button', async () => {
      const screen = renderBidsTableContent({ contractAddress: STOLEN_LAND.contractAddress, tokenId: '1' })
      expect(await screen.findByRole('button', { name: t('bids_table.make_offer') })).toBeInTheDocument()
    })
  })

  describe('and it was stolen', () => {
    it('should not show the make offer button', async () => {
      const screen = renderBidsTableContent(STOLEN_LAND)
      expect(await screen.findByText(t('bids_table.no_bids'))).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: t('bids_table.make_offer') })).not.toBeInTheDocument()
    })
  })
})
