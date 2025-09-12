import { waitFor } from '@testing-library/react'
import { ChainId, Item, Network, NFTCategory, Rarity } from '@dcl/schemas'
import * as containersModule from 'decentraland-dapps/dist/containers'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { OwnersResponse } from '../../../modules/vendor/decentraland'
import { marketplaceAPI } from '../../../modules/vendor/decentraland/marketplace/api'
import { renderWithProviders } from '../../../utils/tests'
import OwnersTable from './OwnersTable'

const ownerIdMock = '0x92712b730b9a474f99a47bb8b1750190d5959a2b'

jest.mock('../../../modules/vendor/decentraland/nft/api')
jest.mock('../../../modules/vendor/decentraland/marketplace/api', () => ({
  marketplaceAPI: {
    fetchOwners: jest.fn()
  }
}))
jest.mock('decentraland-dapps/dist/containers', () => {
  const module = jest.requireActual<typeof containersModule>('decentraland-dapps/dist/containers')
  return {
    ...module,
    Profile: () => <div>{ownerIdMock}</div>
  } as unknown
})

describe('Owners Table', () => {
  const asset: Item = {
    contractAddress: '0xaddress',
    urn: '',
    itemId: '1',
    id: '1',
    name: 'asset name',
    thumbnail: '',
    url: '',
    category: NFTCategory.WEARABLE,
    rarity: Rarity.UNIQUE,
    price: '10',
    available: 2,
    isOnSale: false,
    creator: '0xcreator',
    beneficiary: null,
    createdAt: 1671033414000,
    updatedAt: 1671033414000,
    reviewedAt: 1671033414000,
    soldAt: 1671033414000,
    data: {
      parcel: undefined,
      estate: undefined,
      wearable: undefined,
      ens: undefined,
      emote: undefined
    },
    network: Network.MATIC,
    chainId: ChainId.ETHEREUM_GOERLI,
    firstListedAt: null
  }
  const ownersResponse: OwnersResponse = {
    issuedId: 1,
    ownerId: ownerIdMock,
    orderStatus: 'open',
    orderExpiresAt: '1671033414000',
    tokenId: '1'
  }

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('Empty table', () => {
    beforeEach(() => {
      ;(marketplaceAPI.fetchOwners as jest.Mock).mockResolvedValueOnce({
        data: [],
        total: 0
      })
    })

    it('should render the empty table message', async () => {
      const { getByText, queryByTestId } = renderWithProviders(<OwnersTable asset={asset} />)

      // Wait for loading to finish and empty state to be shown
      await waitFor(() => {
        expect(queryByTestId('loader')).not.toBeInTheDocument()
      })

      await waitFor(() => {
        expect(getByText(t('owners_table.there_are_no_owners'))).toBeInTheDocument()
      })
    })
  })

  describe('Should render the table correctly', () => {
    beforeEach(() => {
      ;(marketplaceAPI.fetchOwners as jest.Mock).mockResolvedValueOnce({
        data: [ownersResponse],
        total: 1
      })
    })

    it('should render the table', async () => {
      const { queryByTestId, getByTestId } = renderWithProviders(<OwnersTable asset={asset} />)

      // Wait for loading to finish
      await waitFor(() => {
        expect(queryByTestId('loader')).not.toBeInTheDocument()
      })

      // Wait for table to be rendered
      await waitFor(() => {
        expect(getByTestId('table-content')).toBeInTheDocument()
      })
    })

    it('should render the table data correctly', async () => {
      const { queryByTestId, getByText } = renderWithProviders(<OwnersTable asset={asset} />)

      // Wait for loading to finish
      await waitFor(() => {
        expect(queryByTestId('loader')).not.toBeInTheDocument()
      })

      // Wait for table headers to be rendered
      await waitFor(() => {
        expect(getByText('Owner')).toBeInTheDocument()
        expect(getByText('Issue Number')).toBeInTheDocument()
      })

      // Check that the issued ID is rendered (just look for the number itself)
      await waitFor(() => {
        // Look for the specific issued ID number
        expect(getByText(ownersResponse.issuedId.toString())).toBeInTheDocument()
      })
    })
  })
})
