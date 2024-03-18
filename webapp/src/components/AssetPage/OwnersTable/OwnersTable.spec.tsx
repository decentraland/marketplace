import { ChainId, Item, Network, NFTCategory, Rarity } from '@dcl/schemas'
import { waitFor } from '@testing-library/react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { OwnersResponse } from '../../../modules/vendor/decentraland'
import * as nftAPI from '../../../modules/vendor/decentraland/nft/api'
import { renderWithProviders } from '../../../utils/tests'
import OwnersTable from './OwnersTable'

const ownerIdMock = '0x92712b730b9a474f99a47bb8b1750190d5959a2b'

jest.mock('../../../modules/vendor/decentraland/nft/api')
jest.mock('decentraland-dapps/dist/containers', () => {
  const module = jest.requireActual('decentraland-dapps/dist/containers')
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
      ;(nftAPI.nftAPI.getOwners as jest.Mock).mockResolvedValueOnce({
        data: [],
        total: 0
      })
    })

    it('should render the empty table message', async () => {
      const { getByText, findByTestId } = renderWithProviders(<OwnersTable asset={asset} />)

      const loader = await findByTestId('loader')

      await waitFor(() => {
        expect(loader).not.toBeInTheDocument()
      })

      expect(getByText(t('owners_table.there_are_no_owners'))).toBeInTheDocument()
    })
  })

  describe('Should render the table correctly', () => {
    beforeEach(() => {
      ;(nftAPI.nftAPI.getOwners as jest.Mock).mockResolvedValueOnce({
        data: [ownersResponse],
        total: 1
      })
    })

    it('should render the table', async () => {
      const screen = renderWithProviders(<OwnersTable asset={asset} />)

      const { findByTestId, getByTestId } = screen

      const loader = await findByTestId('loader')

      await waitFor(() => {
        expect(loader).not.toBeInTheDocument()
      })

      expect(getByTestId('table-content')).not.toBe(null)
    })

    it('should render the table data correctly', async () => {
      const screen = renderWithProviders(<OwnersTable asset={asset} />)

      const { findByTestId, getByText } = screen

      const loader = await findByTestId('loader')

      await waitFor(() => {
        expect(loader).not.toBeInTheDocument()
      })

      expect(getByText(ownersResponse.ownerId)).not.toBe(null)
      expect(getByText(ownersResponse.issuedId)).not.toBe(null)
    })
  })
})
