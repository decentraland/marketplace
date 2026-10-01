import { Bid, ChainId, NFTCategory, Network, Order } from '@dcl/schemas'
import { STOLEN_NFT_KEYS } from '../../../lib/stolenNfts'
import { NFT } from '../../../modules/nft/types'
import { useGetCurrentOrder } from '../../../modules/order/hooks'
import { VendorName } from '../../../modules/vendor'
import { renderWithProviders } from '../../../utils/test'
import BuyNFTBox from './BuyNFTBox'
import { Props } from './BuyNFTBox.types'

jest.mock('../../../modules/order/hooks')
jest.mock('../SaleActionBox/BuyNFTButtons', () => ({ BuyNFTButtons: () => <div data-testid="buy-nft-buttons" /> }))
jest.mock('../../BidButton', () => ({
  __esModule: true,
  default: ({ alreadyBid }: { alreadyBid: boolean }) => <div data-testid="bid-button" data-already-bid={String(alreadyBid)} />
}))
jest.mock('../PriceComponent', () => ({ __esModule: true, default: () => <div data-testid="price-component" /> }))

const mockedUseGetCurrentOrder = useGetCurrentOrder as jest.MockedFunction<typeof useGetCurrentOrder>

const [stolenChainId, stolenContractAddress, stolenTokenId] = STOLEN_NFT_KEYS.find(key => key.startsWith('1:'))!.split(':')

describe('BuyNFTBox', () => {
  let props: Props
  let nft: NFT

  beforeEach(() => {
    nft = {
      id: 'an-nft',
      contractAddress: '0xcontract',
      tokenId: '1',
      chainId: ChainId.ETHEREUM_MAINNET,
      network: Network.ETHEREUM,
      category: NFTCategory.WEARABLE,
      owner: '0xowner',
      vendor: VendorName.DECENTRALAND,
      data: {}
    } as NFT
    props = {
      nft,
      address: '0xbuyer',
      wallet: null,
      bids: [] as Bid[],
      credits: null,
      onFetchBids: jest.fn()
    }
  })

  describe('when the nft has a listing', () => {
    beforeEach(() => {
      mockedUseGetCurrentOrder.mockReturnValue({ price: '1', expiresAt: Date.now() / 1000 + 86400, issuedId: '1' } as unknown as Order)
    })

    describe('and it was not reported as stolen', () => {
      it('should render the price and the buy and the bid buttons', () => {
        const { getByTestId } = renderWithProviders(<BuyNFTBox {...props} />)
        expect(getByTestId('price-component')).toBeInTheDocument()
        expect(getByTestId('buy-nft-buttons')).toBeInTheDocument()
        expect(getByTestId('bid-button')).toBeInTheDocument()
      })
    })

    describe('and the buyer only has a bid on a paused marketplace contract', () => {
      beforeEach(() => {
        props.bids = [{ bidder: '0xbuyer', paused: true } as Bid]
      })

      it('should let the buyer make a new offer', () => {
        const { getByTestId } = renderWithProviders(<BuyNFTBox {...props} />)
        expect(getByTestId('bid-button')).toHaveAttribute('data-already-bid', 'false')
      })
    })

    describe('and the buyer has a bid on an active marketplace contract', () => {
      beforeEach(() => {
        props.bids = [{ bidder: '0xbuyer' } as Bid]
      })

      it('should lock the offer button', () => {
        const { getByTestId } = renderWithProviders(<BuyNFTBox {...props} />)
        expect(getByTestId('bid-button')).toHaveAttribute('data-already-bid', 'true')
      })
    })

    describe('and it was reported as stolen', () => {
      beforeEach(() => {
        props.nft = { ...nft, chainId: Number(stolenChainId), contractAddress: stolenContractAddress, tokenId: stolenTokenId } as NFT
      })

      it('should render the warning without the price nor the buy and the bid buttons', () => {
        const { getByTestId, queryByTestId } = renderWithProviders(<BuyNFTBox {...props} />)
        expect(getByTestId('stolen-nft-warning')).toBeInTheDocument()
        expect(queryByTestId('price-component')).not.toBeInTheDocument()
        expect(queryByTestId('buy-nft-buttons')).not.toBeInTheDocument()
        expect(queryByTestId('bid-button')).not.toBeInTheDocument()
      })
    })
  })

  describe('when the nft has no listing and it was reported as stolen', () => {
    beforeEach(() => {
      mockedUseGetCurrentOrder.mockReturnValue(null)
      props.nft = { ...nft, chainId: Number(stolenChainId), contractAddress: stolenContractAddress, tokenId: stolenTokenId } as NFT
    })

    it('should not render the bid button', () => {
      const { queryByTestId } = renderWithProviders(<BuyNFTBox {...props} />)
      expect(queryByTestId('bid-button')).not.toBeInTheDocument()
    })
  })
})
