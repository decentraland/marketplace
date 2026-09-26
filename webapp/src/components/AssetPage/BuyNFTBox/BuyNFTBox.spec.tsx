import { Bid, ChainId, NFTCategory, Network, Order } from '@dcl/schemas'
import stolenNftKeys from '../../../lib/stolenNfts.json'
import { NFT } from '../../../modules/nft/types'
import { useGetCurrentOrder } from '../../../modules/order/hooks'
import { VendorName } from '../../../modules/vendor'
import { renderWithProviders } from '../../../utils/test'
import BuyNFTBox from './BuyNFTBox'
import { Props } from './BuyNFTBox.types'

jest.mock('../../../modules/order/hooks')
jest.mock('../SaleActionBox/BuyNFTButtons', () => ({ BuyNFTButtons: () => <div data-testid="buy-nft-buttons" /> }))
jest.mock('../../BidButton', () => ({ __esModule: true, default: () => <div data-testid="bid-button" /> }))
jest.mock('../PriceComponent', () => ({ __esModule: true, default: () => <div /> }))

const mockedUseGetCurrentOrder = useGetCurrentOrder as jest.MockedFunction<typeof useGetCurrentOrder>

const [stolenChainId, stolenContractAddress, stolenTokenId] = stolenNftKeys.find(key => key.startsWith('1:'))!.split(':')

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
      it('should render the buy and the bid buttons', () => {
        const { getByTestId } = renderWithProviders(<BuyNFTBox {...props} />)
        expect(getByTestId('buy-nft-buttons')).toBeInTheDocument()
        expect(getByTestId('bid-button')).toBeInTheDocument()
      })
    })

    describe('and it was reported as stolen', () => {
      beforeEach(() => {
        props.nft = { ...nft, chainId: Number(stolenChainId), contractAddress: stolenContractAddress, tokenId: stolenTokenId } as NFT
      })

      it('should not render the buy and the bid buttons', () => {
        const { queryByTestId } = renderWithProviders(<BuyNFTBox {...props} />)
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
