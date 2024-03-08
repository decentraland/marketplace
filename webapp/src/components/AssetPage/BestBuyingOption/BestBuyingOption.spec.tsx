import { Bid, ChainId, Item, ListingStatus, Network, NFTCategory, Order, Rarity } from '@dcl/schemas'
import React, { RefObject } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'

import * as bidAPI from '../../../modules/vendor/decentraland/bid/api'
import * as orderAPI from '../../../modules/vendor/decentraland/order/api'
import { renderWithProviders } from '../../../utils/tests'
import BestBuyingOption from './BestBuyingOption'
import { formatWeiMANA } from '../../../lib/mana'

jest.mock('../../../modules/vendor/decentraland/nft/api')
jest.mock('../../../modules/vendor/decentraland/order/api')
jest.mock('../../../modules/vendor/decentraland/bid/api')
jest.mock('decentraland-dapps/dist/containers', () => {
  const module = jest.requireActual('decentraland-dapps/dist/containers')
  return {
    ...module,
    Profile: () => <div></div>
  }
})

const dateNowFn = Date.now

describe('Best Buying Option', () => {
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
    isOnSale: true,
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

  const orderResponse: Order = {
    id: '1',
    marketplaceAddress: '0xmarketplace',
    contractAddress: '0xaddress',
    tokenId: '1',
    owner: '0x92712b730b9a474f99a47bb8b1750190d5959a2b',
    buyer: null,
    price: '100000000000000000000',
    status: ListingStatus.OPEN,
    expiresAt: 1671033414,
    createdAt: 1671033414000,
    updatedAt: 0,
    network: Network.MATIC,
    chainId: ChainId.ETHEREUM_GOERLI,
    issuedId: '1'
  }

  const bid: Bid = {
    id: '1',
    bidAddress: '0xbid',
    bidder: 'bidder',
    seller: 'seller',
    price: '2',
    fingerprint: '',
    status: ListingStatus.OPEN,
    blockchainId: '1',
    blockNumber: '',
    expiresAt: 1671033414,
    createdAt: 1671033414000,
    updatedAt: 0,
    contractAddress: '0xaddress',
    tokenId: '',
    network: Network.MATIC,
    chainId: ChainId.ETHEREUM_GOERLI
  }

  afterEach(() => {
    jest.resetAllMocks()
    Date.now = dateNowFn
  })

  describe('Mint option', () => {
    it('should render the mint option', async () => {
      const reference: RefObject<HTMLDivElement> = React.createRef()
      const { getByText } = renderWithProviders(<BestBuyingOption asset={asset} tableRef={reference} />)

      expect(getByText(t('best_buying_option.minting.title'))).toBeInTheDocument()
    })

    it('should render the mint price', async () => {
      const reference: RefObject<HTMLDivElement> = React.createRef()
      const { getByText } = renderWithProviders(<BestBuyingOption asset={asset} tableRef={reference} />)

      const price = formatWeiMANA(asset.price)

      expect(getByText(price)).toBeInTheDocument()
    })
  })

  describe('Listing option', () => {
    beforeEach(() => {
      Date.now = () => 1671033414000
      asset.available = 0
      ;(orderAPI.orderAPI.fetchOrders as jest.Mock).mockResolvedValueOnce({
        data: [orderResponse],
        total: 1
      })
      ;(bidAPI.bidAPI.fetchByNFT as jest.Mock).mockResolvedValueOnce({
        data: [bid],
        total: 1
      })
    })

    it('should render the listing option', async () => {
      const reference: RefObject<HTMLDivElement> = React.createRef()
      const { findByTestId, findByText } = renderWithProviders(<BestBuyingOption asset={asset} tableRef={reference} />)

      await findByTestId('best-buying-option-container')

      expect(
        await findByText(t('best_buying_option.buy_listing.title'), {
          exact: false
        })
      ).toBeInTheDocument()
    })

    it('should render the listing price and de highest offer for that NFT', async () => {
      const reference: RefObject<HTMLDivElement> = React.createRef()
      const { getByText, findByTestId } = renderWithProviders(<BestBuyingOption asset={asset} tableRef={reference} />)

      await findByTestId('best-buying-option-container')

      const price = formatWeiMANA(orderResponse.price)

      const highestOffer = formatWeiMANA(bid.price)

      expect(getByText(price)).toBeInTheDocument()
      expect(getByText(highestOffer)).toBeInTheDocument()
    })
  })

  describe('No available options', () => {
    beforeEach(() => {
      asset.available = 0
      ;(orderAPI.orderAPI.fetchOrders as jest.Mock).mockResolvedValueOnce({
        data: [],
        total: 0
      })
      ;(bidAPI.bidAPI.fetchByNFT as jest.Mock).mockResolvedValueOnce({
        data: [bid],
        total: 0
      })
    })

    it('should render no options available', async () => {
      const reference: RefObject<HTMLDivElement> = React.createRef()
      const { getByText, findByTestId } = renderWithProviders(<BestBuyingOption asset={asset} tableRef={reference} />)

      await findByTestId('best-buying-option-container')

      expect(getByText(t('best_buying_option.empty.title'))).toBeInTheDocument()
    })
  })
})
