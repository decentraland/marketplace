import {
  ChainId,
  Item,
  ListingStatus,
  Network,
  NFTCategory,
  Order,
  Rarity
} from '@dcl/schemas'
import { waitFor, within } from '@testing-library/react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { formatDistanceToNow, getDateAndMonthName } from '../../../lib/date'
import { formatWeiMANA } from '../../../lib/mana'
import { OwnersResponse } from '../../../modules/vendor/decentraland'
import * as nftAPI from '../../../modules/vendor/decentraland/nft/api'
import * as orderAPI from '../../../modules/vendor/decentraland/order/api'
import { renderWithProviders } from '../../../utils/tests'
import ListingsTable, { ROWS_PER_PAGE } from './ListingsTable'

jest.mock('../../../modules/vendor/decentraland/nft/api')
jest.mock('../../../modules/vendor/decentraland/order/api')
jest.mock('decentraland-dapps/dist/containers', () => {
  const module = jest.requireActual('decentraland-dapps/dist/containers')
  return {
    ...module,
    Profile: () => <div></div>
  }
})

describe('Listings Table', () => {
  let asset: Item = {
    contractAddress: '0xaddress',
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

  let ownersResponse: OwnersResponse = {
    issuedId: 1,
    ownerId: '0x92712b730b9a474f99a47bb8b1750190d5959a2b',
    orderStatus: 'open',
    orderExpiresAt: '1671033414000',
    tokenId: '1'
  }

  let orderResponse: Order = {
    id: '1',
    marketplaceAddress: '0xmarketplace',
    contractAddress: '0xaddress',
    tokenId: '1',
    owner: '0x92712b730b9a474f99a47bb8b1750190d5959a2b',
    buyer: null,
    price: '10',
    status: ListingStatus.OPEN,
    expiresAt: 1671033414000,
    createdAt: 1671033414000,
    updatedAt: 0,
    network: Network.MATIC,
    chainId: ChainId.ETHEREUM_GOERLI
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
      ;(orderAPI.orderAPI.fetchOrders as jest.Mock).mockResolvedValueOnce({
        data: [],
        total: 0
      })
    })

    it('should render the empty table message', async () => {
      const { getByText, findByTestId } = renderWithProviders(
        <ListingsTable asset={asset} />
      )

      const loader = await findByTestId('loader')

      await waitFor(() => {
        expect(loader).not.toBeInTheDocument()
      })

      expect(
        getByText(t('listings_table.there_are_no_listings'))
      ).toBeInTheDocument()
    })
  })

  describe('Should render the table correctly', () => {
    beforeEach(() => {
      ;(nftAPI.nftAPI.getOwners as jest.Mock).mockResolvedValueOnce({
        data: [ownersResponse],
        total: 1
      })
      ;(orderAPI.orderAPI.fetchOrders as jest.Mock).mockResolvedValueOnce({
        data: [orderResponse],
        total: 1
      })
    })

    it('should render the table', async () => {
      const screen = renderWithProviders(<ListingsTable asset={asset} />)

      const { findByTestId, getByTestId } = screen

      const loader = await findByTestId('loader')

      await waitFor(() => {
        expect(loader).not.toBeInTheDocument()
      })

      expect(getByTestId('listings-table')).not.toBe(null)
    })

    it('should render the table data correctly', async () => {
      const screen = renderWithProviders(<ListingsTable asset={asset} />)

      const { findByTestId, getByText } = screen

      const loader = await findByTestId('loader')

      await waitFor(() => {
        expect(loader).not.toBeInTheDocument()
      })

      const created = getDateAndMonthName(orderResponse.createdAt)
      const expires = formatDistanceToNow(+orderResponse.expiresAt, {
        addSuffix: true
      })
      const price = formatWeiMANA(orderResponse.price)

      expect(getByText(orderResponse.tokenId)).not.toBe(null)
      expect(getByText(created)).not.toBe(null)
      expect(getByText(expires)).not.toBe(null)
      expect(getByText(price)).not.toBe(null)
    })
  })

  describe('Pagination', () => {
    describe('Should have pagination', () => {
      beforeEach(() => {
        ;(nftAPI.nftAPI.getOwners as jest.Mock).mockResolvedValueOnce({
          data: Array(ROWS_PER_PAGE + 1).fill(ownersResponse),
          total: 7
        })
        ;(orderAPI.orderAPI.fetchOrders as jest.Mock).mockResolvedValueOnce({
          data: Array(ROWS_PER_PAGE + 1).fill(orderResponse),
          total: 7
        })
      })

      it('should render the pagination correctly', async () => {
        const screen = renderWithProviders(<ListingsTable asset={asset} />)

        const { findByTestId, getByRole } = screen

        const loader = await findByTestId('loader')

        await waitFor(() => {
          expect(loader).not.toBeInTheDocument()
        })

        const navigation = getByRole('navigation')

        expect(within(navigation).getByText('1')).toBeInTheDocument()
        expect(within(navigation).getByText('2')).toBeInTheDocument()
      })
    })

    describe('Should not have pagination', () => {
      beforeEach(() => {
        ;(nftAPI.nftAPI.getOwners as jest.Mock).mockResolvedValueOnce({
          data: Array(ROWS_PER_PAGE - 1).fill(ownersResponse),
          total: 5
        })
        ;(orderAPI.orderAPI.fetchOrders as jest.Mock).mockResolvedValueOnce({
          data: Array(ROWS_PER_PAGE - 1).fill(orderResponse),
          total: 5
        })
      })

      it('should not render pagination as there is no need', async () => {
        const screen = renderWithProviders(<ListingsTable asset={asset} />)

        const { findByTestId, queryByRole } = screen

        const loader = await findByTestId('loader')

        await waitFor(() => {
          expect(loader).not.toBeInTheDocument()
        })

        expect(queryByRole('navigation')).not.toBeInTheDocument()
      })
    })
  })
})
