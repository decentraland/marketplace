import { waitFor } from '@testing-library/react'
import { ChainId, NFTCategory, Network } from '@dcl/schemas'
import { AuthorizationType } from 'decentraland-dapps/dist/modules/authorization/types'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { nftMarketplaceAPI } from '../../modules/vendor/decentraland/nft/api'
import { renderWithProviders } from '../../utils/test'
import SettingsPage from './SettingsPage'
import { Props } from './SettingsPage.types'

jest.mock('../../modules/vendor/decentraland/nft/api', () => ({
  nftMarketplaceAPI: { fetch: jest.fn() }
}))

const aWallet = { address: '0xowner' } as Wallet

function heldNft(contractAddress: string) {
  return {
    nft: {
      contractAddress,
      chainId: ChainId.MATIC_MAINNET,
      network: Network.MATIC,
      category: NFTCategory.WEARABLE
    }
  }
}

function renderSettingsPage(props: Partial<Props> = {}) {
  return renderWithProviders(
    <SettingsPage
      wallet={aWallet}
      authorizations={[]}
      isLoading={false}
      hasError={false}
      isConnecting={false}
      hasFetchedContracts
      getContract={jest.fn()}
      onFetchContracts={jest.fn()}
      onFetchAuthorizations={jest.fn()}
      {...props}
    />
  )
}

describe('when rendering the settings page', () => {
  let onFetchAuthorizations: jest.Mock

  beforeEach(() => {
    onFetchAuthorizations = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('and the wallet holds collectibles', () => {
    beforeEach(() => {
      // Two tokens of the SAME collection: the page asks about collections, not about tokens.
      ;(nftMarketplaceAPI.fetch as jest.Mock).mockResolvedValue({
        data: [heldNft('0xcollection'), heldNft('0xcollection')],
        total: 2
      })
    })

    it('should ask about the selling approval of each distinct collection', async () => {
      renderSettingsPage({ onFetchAuthorizations })

      await waitFor(() => expect(onFetchAuthorizations).toHaveBeenCalled())

      const asked = onFetchAuthorizations.mock.calls[0][0] as { contractAddress: string; type: AuthorizationType }[]
      expect(asked.every(authorization => authorization.type === AuthorizationType.APPROVAL)).toBe(true)
      expect(new Set(asked.map(authorization => authorization.contractAddress))).toEqual(new Set(['0xcollection']))
    })
  })

  describe('and there is no wallet', () => {
    it('should not ask about anything, since approvals belong to an address', async () => {
      renderSettingsPage({ wallet: null, onFetchAuthorizations })

      await waitFor(() => expect(nftMarketplaceAPI.fetch).not.toHaveBeenCalled())
      expect(onFetchAuthorizations).not.toHaveBeenCalled()
    })
  })
})
